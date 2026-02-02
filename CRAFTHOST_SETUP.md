# CraftHost - Minecraft Server Manager

A fully functional Windows desktop application for hosting Minecraft servers on your PC.

## Features

- **Real Server Management**: Start, stop, and restart actual Minecraft servers
- **Multiple Server Types**: Supports Vanilla, Paper, Spigot, Forge, and Fabric
- **Live Console**: Real-time server console with command execution
- **File Manager**: Browse, edit, upload, and manage server files
- **Mod/Plugin Support**: Dedicated folders for mods and plugins
- **Player Management**: View players, manage whitelist, ops, and bans
- **Resource Monitoring**: Real-time CPU, RAM, and TPS tracking
- **Automatic Backups**: Configure automated server backups

## Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   - Download from https://nodejs.org/

2. **Java** (v17 or higher for Minecraft 1.18+)
   - Download from https://adoptium.net/

3. **Minecraft Server JAR files**
   - Vanilla: https://www.minecraft.net/en-us/download/server
   - Paper: https://papermc.io/downloads
   - Spigot: https://www.spigotmc.org/
   - Forge: https://files.minecraftforge.net/
   - Fabric: https://fabricmc.net/use/server/

## Installation

### Step 1: Download and Install

```bash
# Download the code from v0
# Extract the ZIP file to your desired location

# Navigate to the project directory
cd crafthost

# Install dependencies
npm install
```

### Step 2: Build the Application

```bash
# Build the Next.js application
npm run build
```

### Step 3: Run CraftHost

```bash
# Start the application
npm start
```

The application will open at `http://localhost:3000`

## First-Time Setup

### Creating Your First Server

1. Open CraftHost (http://localhost:3000/app)
2. Click "Create Server"
3. Fill in the server details:
   - **Name**: Choose a name for your server
   - **Type**: Select server type (Vanilla, Paper, Spigot, Forge, Fabric)
   - **Version**: Enter Minecraft version (e.g., 1.21.4)
   - **Port**: Default is 25565
   - **RAM**: Allocate memory in MB (e.g., 4096 for 4GB)
4. Click "Create Server"

### Adding Server JAR File

After creating a server, you MUST add the server.jar file:

1. Navigate to the server directory:
   ```
   crafthost/minecraft-servers/server-[ID]/
   ```

2. Download the appropriate server JAR for your server type

3. Place the JAR file and rename it to `server.jar`

4. Return to CraftHost and click "Start" on your server

### Adding Mods or Plugins

**For Forge/Fabric (Mods):**
1. Navigate to `minecraft-servers/server-[ID]/mods/`
2. Place your .jar mod files in this folder
3. Restart the server

**For Spigot/Paper (Plugins):**
1. Navigate to `minecraft-servers/server-[ID]/plugins/`
2. Place your .jar plugin files in this folder
3. Restart the server

## Server Management

### Starting a Server

1. Go to the Dashboard
2. Find your server card
3. Click "Start"
4. Monitor the console for "Done!" message

### Stopping a Server

1. Click "Stop" on the server card
2. Server will gracefully shutdown
3. Wait for confirmation

### Using the Console

1. Click "Console" on any server
2. View real-time server logs
3. Type commands in the input box
4. Press Enter or click Send
5. Use ↑/↓ arrows for command history

**Common Commands:**
- `list` - Show online players
- `op <player>` - Make player an operator
- `whitelist add <player>` - Add to whitelist
- `ban <player>` - Ban a player
- `save-all` - Save the world
- `stop` - Stop the server

### Managing Files

1. Click "Files" on any server
2. Navigate folders by clicking them
3. Upload files using the "Upload" button
4. Edit text files by clicking them
5. Delete files/folders with the trash icon

**Important Files:**
- `server.properties` - Server configuration
- `eula.txt` - EULA agreement (must be true)
- `whitelist.json` - Whitelist management
- `ops.json` - Operator permissions
- `banned-players.json` - Ban list

## Port Forwarding (For Public Servers)

To allow players outside your network to join:

1. Find your router's IP address (usually 192.168.1.1 or 192.168.0.1)
2. Log into your router's admin panel
3. Find "Port Forwarding" settings
4. Create a new rule:
   - **External Port**: 25565 (or your server port)
   - **Internal Port**: 25565 (or your server port)
   - **Internal IP**: Your PC's local IP
   - **Protocol**: TCP/UDP
5. Save the settings

### Finding Your Public IP

Players need your public IP to connect:

```bash
# Windows Command Prompt
curl ifconfig.me

# Or visit
https://whatismyipaddress.com/
```

Share `<your-public-ip>:25565` with players

## Troubleshooting

### Server Won't Start

**Problem**: Server immediately stops after starting

**Solutions**:
1. Check that `server.jar` exists in the server directory
2. Verify Java is installed: `java -version`
3. Check the console logs for error messages
4. Ensure EULA is accepted in `eula.txt`

### "Address already in use" Error

**Problem**: Port is already being used

**Solutions**:
1. Change the server port in server creation
2. Stop any other Minecraft servers
3. Check if another application is using the port

### High RAM Usage

**Problem**: Server using too much memory

**Solutions**:
1. Reduce allocated RAM in server settings
2. Optimize server.properties:
   - Lower `view-distance`
   - Reduce `max-players`
3. Use Paper instead of Vanilla (better optimization)
4. Add optimization plugins like ClearLagg

### Players Can't Connect

**Problem**: Server running but players can't join

**Solutions**:
1. Verify port forwarding is set up correctly
2. Check firewall isn't blocking Java or the port
3. Ensure players are using correct IP:PORT
4. Try connecting locally first (localhost:25565)
5. Check `online-mode` in server.properties

## Advanced Configuration

### Custom JVM Arguments

Edit the server spawn command in `lib/server-mock.ts` or when deployed in your Node.js backend:

```typescript
const args = [
  `-Xmx${server.allocatedRam}M`,
  `-Xms${Math.floor(server.allocatedRam / 2)}M`,
  // Add custom flags here
  '-XX:+UseG1GC',
  '-XX:+ParallelRefProcEnabled',
  '-jar',
  'server.jar',
  'nogui',
]
```

### Automatic Backups

Backups are saved in the `backups/` folder of each server.

To restore a backup:
1. Stop the server
2. Copy backup contents to server directory
3. Start the server

### Running as Windows Service

For production use, consider running CraftHost as a Windows service:

```bash
npm install -g node-windows
```

Then create a service script following node-windows documentation.

## Performance Tips

1. **Use Paper**: Much better performance than Vanilla
2. **Allocate appropriate RAM**: 2-4GB for vanilla, 4-8GB for modded
3. **Optimize server.properties**:
   - `view-distance=8` (default 10)
   - `simulation-distance=6` (default 10)
4. **Use SSD**: Install servers on an SSD drive
5. **Pre-generate world**: Use chunky plugin to pre-generate chunks

## Security Best Practices

1. **Never share your admin password**
2. **Use whitelist**: Enable whitelist for private servers
3. **Regular backups**: Backup before major changes
4. **Update regularly**: Keep Minecraft and server software updated
5. **Monitor logs**: Check for suspicious activity
6. **Use strong passwords**: If using authentication plugins

## Support

For issues with CraftHost:
- Check the console logs (F12 in browser)
- Review server console for errors
- Ensure Java and Node.js are up to date

For Minecraft server issues:
- Visit official Minecraft forums
- Check Paper/Spigot/Forge documentation
- Review plugin/mod compatibility

## File Structure

```
crafthost/
├── app/                    # Next.js pages
├── components/             # React components
├── lib/                    # Server management logic
├── minecraft-servers/      # All server data
│   ├── servers.json       # Server configuration
│   └── server-[ID]/       # Individual server folders
│       ├── server.jar     # Server executable
│       ├── mods/          # Mod files (Forge/Fabric)
│       ├── plugins/       # Plugin files (Spigot/Paper)
│       ├── world/         # World data
│       ├── backups/       # Backup files
│       └── server.properties
└── CRAFTHOST_SETUP.md     # This file
```

## License

This application is provided as-is for personal use. Minecraft is owned by Mojang Studios.

---

**Enjoy hosting your Minecraft servers with CraftHost!**
