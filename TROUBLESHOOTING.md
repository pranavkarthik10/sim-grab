# sim-grab Troubleshooting

## `npx: command not found`

Install Node.js 18+ and npm, then run:

```bash
npx sim-grab
```

## `no booted simulator`

Open Simulator.app and boot a device, or run:

```bash
xcrun simctl boot <udid>
```

List available devices with:

```bash
xcrun simctl list devices
```

## `idb not found`

Frames can still stream, but inspection and input need `idb`.

```bash
brew install facebook/fb/idb-companion
pipx install fb-idb
```

After installing, restart `sim-grab`. The bridge automatically runs `idb connect <udid>` for the active simulator target.

## Screen Recording Permission Denied

ScreenCaptureKit needs Screen Recording permission for the terminal or process that launched `sim-grab`.

Open System Settings -> Privacy & Security -> Screen Recording, enable permission for your terminal app, then restart the terminal and `sim-grab`.

On first run, `sim-grab` builds a small local ScreenCaptureKit helper from the Swift source included in the package. If that build fails, the bridge falls back to slower `simctl` screenshots.

Force the screenshot fallback:

```bash
CAPTURE=0 npx sim-grab
```

## Port Already In Use

The bridge uses `7878` and the web UI uses `7879` by default.

```bash
PORT=8787 SIM_GRAB_WEB_PORT=8788 npx sim-grab
```

## Architecture

`sim-grab` has two pieces:

- `web/`: the browser UI, built with Vite + TypeScript.
- `bridge/`: a Node WebSocket bridge that talks to `simctl`, `idb`, and ScreenCaptureKit.

The bridge streams:

- binary image frames for the simulator view
- JSON snapshots for the accessibility tree
- JSON responses for point inspection and control messages

## Transport Behavior

In `Auto` video mode:

- Inspect mode uses `simctl` screenshots for tighter AX/frame alignment.
- Interaction mode uses ScreenCaptureKit when available for smoother live video.
- CaptureKit is kept warm during Inspect mode so leaving Inspect can switch back quickly.
- If ScreenCaptureKit cannot start or repeatedly stops, the bridge falls back to `simctl` screenshots.

You can force `CaptureKit` or `simctl` from the UI.

## Current Limitations

- The underlying AX tree can still collapse some grouped controls, especially complex nav and tab bars.
- The latent DOM mirror can only expose what the simulator accessibility APIs provide.
- If `idb` is unavailable or unstable, point inspection and input control will degrade or stop working.
