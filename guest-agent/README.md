# Internet Cafe Guest Agent

This is a lightweight agent that runs on each guest computer in the internet cafe. It connects to the central server via WebSockets and executes commands like changing passwords and locking the computer.

## Requirements

- Node.js (v14 or higher)
- Windows OS (for the default commands)

## Installation

### Automatic Installation (Windows)

1. Download or clone this repository to the guest computer
2. Run `install.bat` as administrator
3. Follow the prompts to configure the agent

### Manual Installation

1. Download or clone this repository to the guest computer
2. Install dependencies:
   ```
   npm install
   ```
3. Edit `config.json` with your server URL and computer number:
   ```json
   {
   	"serverUrl": "https://your-heroku-app.herokuapp.com",
   	"guestId": "guest-1001",
   	"computerNumber": 1
   }
   ```
4. Run the agent:
   ```
   node agent.js
   ```

## Running as a Service

### Windows

The `install.bat` script will automatically set up the agent as a Windows service using NSSM (Non-Sucking Service Manager).

If you need to manage the service manually:

- Start: `net start InternetCafeAgent`
- Stop: `net stop InternetCafeAgent`
- Remove: `nssm remove InternetCafeAgent confirm`

### Linux

Create a systemd service file at `/etc/systemd/system/internet-cafe-agent.service`:

```
[Unit]
Description=Internet Cafe Agent
After=network.target

[Service]
ExecStart=/usr/bin/node /path/to/agent.js
WorkingDirectory=/path/to/agent/directory
Restart=always
User=root
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Then enable and start the service:

```
sudo systemctl enable internet-cafe-agent
sudo systemctl start internet-cafe-agent
```

## Supported Commands

The agent supports the following commands:

- `changePassword`: Changes the password of the current user
- `lockComputer`: Locks the computer
- `ping`: Simple ping to check if the agent is alive

## Customization

You can modify the `agent.js` file to add more commands or change the existing ones to suit your needs. For example, you might want to change the user account that gets the password changed or add commands to restart the computer.
