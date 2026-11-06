# Set up your agent for Datum Cloud

These are official instructions from Datum to set up a coding agent for Datum Cloud. They are published at <https://agents.datum.net/setup/prompt.md>, so you can check them there at any time.

When you finish, you will have:

- `datumctl`, the Datum Cloud CLI, with every plugin from the official catalog
- `datum-mcp`, the Datum MCP server, connected to this agent
- the hosted Datum Docs MCP server, connected to this agent
- the Datum skills from [datum-cloud/skills](https://github.com/datum-cloud/skills)
- a signed-in `datumctl`, pointed at the right organization and project

Run every command below yourself. Do not ask the user to run them, except for the sign-in in step 5, which needs a person at a terminal and a browser. If a step fails, say which one and why, carry on with the rest, and include it in the summary at the end.

If the user named an organization and project when they gave you this link (for example "Use organization `acme` and project `acme-web`"), remember them for step 5.

## 1. Install datumctl and datum-mcp

Skip any tool that is already installed (`datumctl version`, `command -v datum-mcp`). If it is installed through Homebrew, run `brew upgrade` on it instead.

### macOS and Linux with Homebrew

```bash
brew tap datum-cloud/tap
brew install datumctl datum-mcp
```

### Without Homebrew

`datum-mcp` has an install script:

```bash
curl -fsSL https://github.com/datum-cloud/datum-mcp/releases/latest/download/install.sh | sh
```

For `datumctl`, download the archive (macOS) or package (`.deb`, `.rpm`, `.apk`, Linux) for this OS and CPU from <https://github.com/datum-cloud/datumctl/releases/latest>. Put the binary on `PATH`.

On Windows, download `datum-mcp_windows_<arch>.exe` from <https://github.com/datum-cloud/datum-mcp/releases/latest>, and follow <https://www.datum.net/docs/datumctl/install> for `datumctl`. Use the full path to `datum-mcp.exe` wherever step 3 says `datum-mcp`.

## 2. Install every datumctl plugin

Plugins add commands to `datumctl`, such as `datumctl dns`, `datumctl compute` and `datumctl assistant`. Install every plugin in Datum's official `datum` catalog, and nothing from other catalogs:

```bash
datumctl plugin search --index datum \
  | awk 'NR > 1 { print $1 }' \
  | while read -r plugin; do datumctl plugin install "$plugin"; done
```

Then bring any plugins that were already installed up to date:

```bash
datumctl plugin upgrade --all
```

If the loop installs nothing, run `datumctl plugin search --index datum` and install each plugin it lists by name.

## 3. Connect this agent

Follow the section for the agent you are. Each connects two MCP servers:

| Name               | Kind          | Value                                |
| ------------------ | ------------- | ------------------------------------ |
| `datum-mcp`        | local (stdio) | command `datum-mcp`                  |
| `datum-cloud-docs` | remote (HTTP) | URL `https://www.datum.net/docs/mcp` |

If an entry with the same name already exists, update it instead of adding a duplicate. Keep every other setting in the file.

### Claude Code

Run exactly these two commands. Do not use `claude mcp add` or `npx skills`, because the plugin registers both MCP servers and the skills:

```bash
claude plugin marketplace add datum-cloud/skills
claude plugin install datum-cloud@datum-cloud
```

Then tell the user to run `/reload-plugins`. You cannot run that yourself.

### Every other agent: install the skills

```bash
npx -y skills add datum-cloud/skills --skill '*' --yes --global
```

Then register the MCP servers in the agent's config, as below.

### Codex

```bash
codex mcp add datum-mcp -- datum-mcp
codex mcp add datum-cloud-docs --url https://www.datum.net/docs/mcp
```

### Cursor

In `~/.cursor/mcp.json`, under `"mcpServers"`:

```json
"datum-mcp": { "command": "datum-mcp", "args": [] },
"datum-cloud-docs": { "url": "https://www.datum.net/docs/mcp" }
```

### GitHub Copilot in VS Code

```bash
code --add-mcp '{"name":"datum-mcp","type":"stdio","command":"datum-mcp","args":[]}'
code --add-mcp '{"name":"datum-cloud-docs","type":"http","url":"https://www.datum.net/docs/mcp"}'
```

If `code` is not on `PATH`, add the same entries under `"servers"` in the workspace's `.vscode/mcp.json` instead. VS Code uses `"servers"`, not `"mcpServers"`.

### OpenCode

In `~/.config/opencode/opencode.json` (or `opencode.jsonc`), under `"mcp"`:

```json
"datum-mcp": { "type": "local", "command": ["datum-mcp"], "enabled": true },
"datum-cloud-docs": { "type": "remote", "url": "https://www.datum.net/docs/mcp", "enabled": true }
```

### Windsurf

In `~/.codeium/windsurf/mcp_config.json`, under `"mcpServers"`. Windsurf uses `serverUrl`, not `url`, for remote servers:

```json
"datum-mcp": { "command": "datum-mcp", "args": [] },
"datum-cloud-docs": { "serverUrl": "https://www.datum.net/docs/mcp" }
```

### Any other agent

Add the two servers from the table above wherever the agent keeps its MCP config. Check the agent's own docs for the format.

## 4. Tell the agent how to use Datum

Add this line to your user-level instructions file, unless it is already there: `~/.claude/CLAUDE.md` for Claude Code, `~/.codex/AGENTS.md` for Codex, `~/.config/opencode/AGENTS.md` for OpenCode, or your agent's equivalent.

```text
For Datum Cloud, use the datum-mcp tools in a session and `datumctl` (with its plugins) from the shell. Run `datumctl api-resources` and `datumctl explain <resource>` to learn the API instead of guessing field names.
```

## 5. Sign in

`datumctl` and `datum-mcp` sign in separately and keep separate credentials in the system keyring.

### datumctl

Check first:

```bash
datumctl whoami
```

If that shows a signed-in user, skip to choosing a project below. Otherwise the user has to sign in themselves: `datumctl login` opens a browser and then shows an organization and project picker, and the picker needs an interactive terminal. When run without one, it fails for anyone with more than one project and saves nothing. Ask the user to run:

```bash
datumctl login
```

In Claude Code they can type `! datumctl login` in the prompt. On a machine with no browser (SSH, a container), use `datumctl login --no-browser`, which prints a URL and a code to approve from any device. Wait for the user to say they have finished, then run `datumctl whoami` again.

If the user named an organization and project, make it the active context:

```bash
datumctl ctx use <organization>/<project>
```

Otherwise leave the one they chose in the picker. `datumctl ctx` lists every organization and project they can use.

### datum-mcp

`datum-mcp` signs in by opening a browser on its first tool call. It may not be loaded until the agent restarts (Claude Code: after `/reload-plugins`). If its tools are available now, call its `context` tool to sign in and check the active organization and project. If they are not, tell the user it will ask them to sign in the first time it is used.

## 6. Check

Run these and note the result of each:

```bash
datumctl version
datumctl plugin list
datumctl whoami
datumctl ctx
command -v datum-mcp
```

Then check that the MCP servers are registered, with whatever the agent offers. For example: `claude mcp list` or `claude plugin list`, `codex mcp list`, or reading back the config file you edited.

## 7. Tell the user

Finish with a summary in this shape. Replace each value with what you actually found, and mark anything that failed or was skipped with `✗` and the reason:

```text
Datum Cloud agent setup complete

✓ datumctl        <version>
✓ Plugins         <names of installed plugins>
✓ datum-mcp       <path>, registered with <agent>
✓ Docs MCP        https://www.datum.net/docs/mcp
✓ Skills          datum-cloud/skills
✓ Signed in       <email>, context <organization>/<project>

⚡ Restart your agent (Claude Code: /reload-plugins) to load the MCP servers.
```

Then suggest a first thing to try, such as "List the DNS zones in my project" or "What's running in my project?"

## Reference

- datumctl: <https://github.com/datum-cloud/datumctl> and <https://www.datum.net/docs/datumctl>
- datumctl plugin catalog: <https://github.com/datum-cloud/datumctl-plugins>
- datum-mcp: <https://github.com/datum-cloud/datum-mcp>
- Skills: <https://github.com/datum-cloud/skills>
- Datum Docs MCP: <https://www.datum.net/docs/mcp>
- Service accounts for CI and agents running without a person present: <https://github.com/datum-cloud/datumctl/blob/main/docs/authentication.md#service-accounts-ci-and-automation>
- Agent home: <https://agents.datum.net>
