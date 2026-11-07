# Set up your agent for Datum Cloud

These are official instructions from Datum to set up a coding agent for Datum Cloud. They are published at <https://agents.datum.net/setup/prompt.md>, so you can check them there at any time.

When you finish, you will have:

- `datumctl`, the Datum Cloud CLI, with the plugins the user chose
- `datum-mcp`, the Datum MCP server, connected to this agent
- the hosted Datum Docs MCP server, connected to this agent
- the Datum skills for the products the user chose, from the [Datum plugin marketplace](https://github.com/datum-cloud/claude-code-plugins)
- a signed-in `datumctl`, pointed at the right organization and project

The user doesn't need anything installed beforehand. You download everything from GitHub with `curl` and `tar` (macOS, Linux) or PowerShell (Windows), into a folder in the user's home directory. Never use `sudo` or ask for admin rights.

Run every command below yourself. Do not ask the user to run them. The user answers one question in step 0 and approves the sign-in in their browser in step 5; nothing else. If a step fails, say which one and why, carry on with the rest, and include it in the summary at the end.

If the user named an organization and project when they gave you this link (for example "Use organization `acme` and project `acme-web`"), remember them for step 5.

## 0. Ask the user first

Ask these together, in one message, and wait for the answer. If you have a tool for asking the user structured questions, use it; otherwise ask in the chat.

> I'll install datumctl (the Datum CLI) and the Datum MCP server, and connect them to this agent. Two choices first:
>
> 1. **datumctl plugins** add commands for DNS, compute, load balancers, networking, billing and more, and I'll add my skills for the same products. Install all of them (recommended), pick which ones, or none?
> 2. **Agent instructions:** add one line to your global instructions file (`<path for this agent, from step 4>`) so I use datumctl and the Datum MCP server for Datum work in every project? Yes or no?

If the user says to go ahead with the defaults, install all plugins and add the line.

## 1. Install datumctl and datum-mcp

Run this every time, even if they are already installed: it replaces an existing copy in the same folder with the latest release, and steps 2 and 5 need a recent `datumctl`.

### macOS and Linux

```bash
BIN="$HOME/.local/bin"
mkdir -p "$BIN"
case "$(uname -s)" in
  Darwin) os=Darwin; mos=darwin ;;
  Linux) os=Linux; mos=linux ;;
  *) echo "Unsupported OS: $(uname -s)" >&2; exit 1 ;;
esac
case "$(uname -m)" in
  x86_64 | amd64) arch=x86_64; march=amd64 ;;
  arm64 | aarch64) arch=arm64; march=arm64 ;;
  *) echo "Unsupported CPU: $(uname -m)" >&2; exit 1 ;;
esac
curl -fsSL "https://github.com/datum-cloud/datumctl/releases/latest/download/datumctl_${os}_${arch}.tar.gz" \
  | tar -xz -C "$BIN" datumctl
curl -fsSL -o "$BIN/datum-mcp" \
  "https://github.com/datum-cloud/datum-mcp/releases/latest/download/datum-mcp_${mos}_${march}"
chmod +x "$BIN/datumctl" "$BIN/datum-mcp"
```

The binaries are now at `~/.local/bin/datumctl` and `~/.local/bin/datum-mcp`.

### Windows (PowerShell)

```powershell
$bin = Join-Path $env:LOCALAPPDATA 'Programs\Datum'
New-Item -ItemType Directory -Force -Path $bin | Out-Null
$arm = $env:PROCESSOR_ARCHITECTURE -eq 'ARM64'
$arch = if ($arm) { 'arm64' } else { 'x86_64' }
$march = if ($arm) { 'arm64' } else { 'amd64' }
$zip = Join-Path $env:TEMP 'datumctl.zip'
$unzipped = Join-Path $env:TEMP 'datumctl'
Invoke-WebRequest "https://github.com/datum-cloud/datumctl/releases/latest/download/datumctl_Windows_$arch.zip" -OutFile $zip
Expand-Archive $zip -DestinationPath $unzipped -Force
Copy-Item (Join-Path $unzipped 'datumctl.exe') $bin -Force
Invoke-WebRequest "https://github.com/datum-cloud/datum-mcp/releases/latest/download/datum-mcp_windows_$march.exe" -OutFile (Join-Path $bin 'datum-mcp.exe')
```

The binaries are now in `%LOCALAPPDATA%\Programs\Datum`.

### Put the folder on PATH

Check whether the folder is already on the user's `PATH`. If it isn't, add it, so the user and their tools can run `datumctl` and `datum-mcp` by name:

- **macOS and Linux:** append `export PATH="$HOME/.local/bin:$PATH"` to the startup file of the user's shell (`~/.zshrc` for zsh, `~/.bashrc` for bash, `~/.config/fish/config.fish` with `fish_add_path ~/.local/bin` for fish), unless a line like it is already there.
- **Windows:** `[Environment]::SetEnvironmentVariable('Path', [Environment]::GetEnvironmentVariable('Path', 'User') + ";$bin", 'User')`, unless the folder is already in the user `Path`.

Your current shell won't see the change. For the rest of this guide, run `datumctl` by its full path (`~/.local/bin/datumctl`, or `$bin\datumctl.exe` on Windows) wherever it says `datumctl`.

If `command -v datumctl` (or `Get-Command datumctl`) finds a copy somewhere else first, an older install is shadowing this one. Tell the user, and keep using the full path.

## 2. Install datumctl plugins

Do what the user chose in step 0.

**All:** install every plugin in Datum's official `datum` catalog:

```bash
datumctl plugin install --all-available
```

It installs what is missing, upgrades what is behind, and leaves alone any plugin of the same name the user installed from somewhere else. It only uses the official catalog, so it needs no confirmation. Do not add `--index` or `--yes`.

**Pick:** list the plugins, show the user each one's name and description, and ask which they want:

```bash
datumctl plugin search --index datum
```

Then install each one they choose with `datumctl plugin install <name>`.

**None:** skip this step.

## 3. Connect this agent

Follow the section for the agent you are. Each connects two MCP servers:

| Name               | Kind          | Value                                |
| ------------------ | ------------- | ------------------------------------ |
| `datum-mcp`        | local (stdio) | the full path to `datum-mcp`         |
| `datum-cloud-docs` | remote (HTTP) | URL `https://www.datum.net/docs/mcp` |

Use the full path to `datum-mcp` from step 1, written out (for example `/Users/alex/.local/bin/datum-mcp` or `C:\Users\alex\AppData\Local\Programs\Datum\datum-mcp.exe`). Config files don't expand `~` or `$HOME`, and editors started from the Dock or Start menu don't see the shell's `PATH`.

If an entry with the same name already exists, update it instead of adding a duplicate. Keep every other setting in the file.

The skills come in groups, one per product. Install the groups that match the user's answer in step 0:

| Install when                  | Claude Code plugin | Skills repository (other agents)        |
| ----------------------------- | ------------------ | --------------------------------------- |
| always                        | `datum-cloud`      | `datum-cloud/skills`                    |
| always                        | `milo-activity`    | `milo-os/activity`                      |
| they chose `compute`          | `datum-compute`    | `datum-cloud/compute`                   |
| they chose `dns`              | `datum-dns`        | `datum-cloud/dns-operator`              |
| they chose `alb` or `network` | `datum-networking` | `datum-cloud/network-services-operator` |
| they chose `telemetry`        | `milo-observe`     | `milo-os/telemetry`                     |

"All" means every row. The other datumctl plugins have no skills of their own.

### Claude Code

Add Datum's plugin marketplace, then install `datum-cloud` and each other plugin from the table. Do not use `claude mcp add` or `npx skills`: `datum-cloud` registers both MCP servers, and the plugins bring the skills.

```bash
claude plugin marketplace add datum-cloud/claude-code-plugins
claude plugin install datum-cloud@datum-claude-code-plugins
claude plugin install milo-activity@datum-claude-code-plugins
claude plugin install <plugin>@datum-claude-code-plugins   # once per row that applies
```

If `claude plugin list` shows `datum-cloud@datum-cloud`, from the older `datum-cloud/skills` marketplace, remove it so the MCP servers aren't registered twice: `claude plugin uninstall datum-cloud@datum-cloud`.

`datum-cloud` starts `datum-mcp` by name, so it relies on the `PATH` change from step 1. Tell the user to run `/reload-plugins`, or to restart Claude Code if you changed `PATH`. You cannot do either yourself.

### Every other agent: install the skills

If `npx` is available, run this once for each repository in the table that applies:

```bash
npx -y skills add <repository> --skill '*' --yes --global
```

If it isn't, use Datum's skill index at <https://agents.datum.net/.well-known/agent-skills/index.json>. For each skill whose `plugin` is one you are installing, download its `url` to `<your agent's skills directory>/<name>/SKILL.md` (for example `~/.codex/skills/<name>/SKILL.md` for Codex; check your agent's docs for others), and check the file's SHA-256 against its `digest` (`shasum -a 256` on macOS, `sha256sum` on Linux). Skip any file that doesn't match.

Then register the MCP servers in the agent's config, as below.

### Codex

```bash
codex mcp add datum-mcp -- "$HOME/.local/bin/datum-mcp"
codex mcp add datum-cloud-docs --url https://www.datum.net/docs/mcp
```

### Cursor

In `~/.cursor/mcp.json`, under `"mcpServers"`:

```json
"datum-mcp": { "command": "<full path to datum-mcp>", "args": [] },
"datum-cloud-docs": { "url": "https://www.datum.net/docs/mcp" }
```

### GitHub Copilot in VS Code

```bash
code --add-mcp "{\"name\":\"datum-mcp\",\"type\":\"stdio\",\"command\":\"$HOME/.local/bin/datum-mcp\",\"args\":[]}"
code --add-mcp '{"name":"datum-cloud-docs","type":"http","url":"https://www.datum.net/docs/mcp"}'
```

If `code` is not on `PATH`, add the same entries under `"servers"` in the workspace's `.vscode/mcp.json` instead. VS Code uses `"servers"`, not `"mcpServers"`.

### OpenCode

In `~/.config/opencode/opencode.json` (or `opencode.jsonc`), under `"mcp"`:

```json
"datum-mcp": { "type": "local", "command": ["<full path to datum-mcp>"], "enabled": true },
"datum-cloud-docs": { "type": "remote", "url": "https://www.datum.net/docs/mcp", "enabled": true }
```

### Windsurf

In `~/.codeium/windsurf/mcp_config.json`, under `"mcpServers"`. Windsurf uses `serverUrl`, not `url`, for remote servers:

```json
"datum-mcp": { "command": "<full path to datum-mcp>", "args": [] },
"datum-cloud-docs": { "serverUrl": "https://www.datum.net/docs/mcp" }
```

### Any other agent

Add the two servers from the table above wherever the agent keeps its MCP config. Check the agent's own docs for the format.

## 4. Add the agent instructions line

Only if the user said yes in step 0. Add this line to your user-level instructions file, unless it is already there: `~/.claude/CLAUDE.md` for Claude Code, `~/.codex/AGENTS.md` for Codex, `~/.config/opencode/AGENTS.md` for OpenCode, or your agent's equivalent.

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

If that shows a signed-in user and the user named an organization and project, switch to it and go on to datum-mcp:

```bash
datumctl ctx use <organization>/<project>
```

Otherwise, sign in. Tell the user a browser window is about to open for them to sign in to Datum Cloud, then run the login yourself. If they named an organization and project:

```bash
datumctl login --project <organization>/<project>
```

If they didn't:

```bash
datumctl login
```

- The command waits until the user finishes in the browser, which can take a few minutes. If your shell tool has a time limit, run it in the background and wait for it to exit rather than cutting it off.
- Without `--project`, login picks the context itself only when the user has a single one. Otherwise it signs in and leaves the context unset. Then run `datumctl ctx`, ask the user which project to use, and run `datumctl ctx use <organization>/<project>`.
- On a machine with no browser (SSH, a container, a remote box), add `--no-browser`. It prints a URL and a short code instead: run it in the background, read its output, give the user the URL and code to approve on any device, and wait for it to exit.

Run `datumctl whoami` afterwards to check the account and context.

### datum-mcp

`datum-mcp` signs in by opening a browser on its first tool call. It may not be loaded until the agent restarts (Claude Code: after `/reload-plugins`). If its tools are available now, call its `context` tool to sign in and check the active organization and project. If they are not, tell the user it will ask them to sign in the first time it is used.

## 6. Check

Run these and note the result of each:

```bash
datumctl version --client
datumctl plugin list
datumctl whoami
datumctl ctx
```

Then check that the MCP servers are registered, with whatever the agent offers. For example: `claude mcp list` or `claude plugin list`, `codex mcp list`, or reading back the config file you edited.

## 7. Tell the user

Finish with a summary in this shape. Replace each value with what you actually found, and mark anything that failed or was skipped with `✗` and the reason:

```text
Datum Cloud agent setup complete

✓ datumctl        <version>, in <folder>
✓ Plugins         <names of installed plugins, or "none, as you chose">
✓ datum-mcp       <full path>, registered with <agent>
✓ Docs MCP        https://www.datum.net/docs/mcp
✓ Skills          <plugins or repositories installed>
✓ Instructions    <file the line was added to, or "skipped, as you chose">
✓ PATH            <startup file you changed, or "already set">
✓ Signed in       <email>, context <organization>/<project>

⚡ Restart your agent (Claude Code: /reload-plugins, or a restart if PATH changed) to load the MCP servers.
```

Then suggest a first thing to try, such as "List the DNS zones in my project" or "What's running in my project?"

## Reference

- datumctl: <https://github.com/datum-cloud/datumctl> and <https://www.datum.net/docs/datumctl>
- datumctl plugin catalog: <https://github.com/datum-cloud/datumctl-plugins>
- datum-mcp: <https://github.com/datum-cloud/datum-mcp>
- Plugin marketplace: <https://github.com/datum-cloud/claude-code-plugins>
- Skill index: <https://agents.datum.net/.well-known/agent-skills/index.json>
- Datum Docs MCP: <https://www.datum.net/docs/mcp>
- Service accounts for CI and agents running without a person present: <https://github.com/datum-cloud/datumctl/blob/main/docs/authentication.md#service-accounts-ci-and-automation>
- Agent home: <https://agents.datum.net>
