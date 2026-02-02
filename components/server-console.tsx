'use client'

import React from "react"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Trash2, Copy, Download } from 'lucide-react'
import { getServerLogs, sendCommand } from '@/app/actions/server-actions'
import { ConsoleLog } from '@/lib/types'

interface ServerConsoleProps {
  serverId: string
  isRunning: boolean
}

export function ServerConsole({ serverId, isRunning }: ServerConsoleProps) {
  const [logs, setLogs] = useState<ConsoleLog[]>([])
  const [command, setCommand] = useState('')
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const consoleRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load logs periodically
  useEffect(() => {
    loadLogs()
    const interval = setInterval(loadLogs, 1000)
    return () => clearInterval(interval)
  }, [serverId])

  // Auto-scroll to bottom
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight
    }
  }, [logs])

  async function loadLogs() {
    const newLogs = await getServerLogs(serverId, 500)
    setLogs(newLogs)
  }

  async function handleSendCommand() {
    if (!command.trim() || !isRunning) return

    await sendCommand(serverId, command)
    setCommandHistory([...commandHistory, command])
    setCommand('')
    setHistoryIndex(-1)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSendCommand()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCommand(commandHistory[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = Math.min(commandHistory.length - 1, historyIndex + 1)
        setHistoryIndex(newIndex)
        setCommand(commandHistory[newIndex])
      }
    }
  }

  function handleClearLogs() {
    setLogs([])
  }

  function handleCopyLogs() {
    const text = logs.map((log) => `[${log.timestamp}] ${log.message}`).join('\n')
    navigator.clipboard.writeText(text)
  }

  function handleDownloadLogs() {
    const text = logs.map((log) => `[${log.timestamp}] ${log.message}`).join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `server-logs-${serverId}-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  function getLogColor(level: ConsoleLog['level']) {
    switch (level) {
      case 'error':
        return 'text-red-400'
      case 'warn':
        return 'text-yellow-400'
      case 'debug':
        return 'text-blue-400'
      default:
        return 'text-foreground'
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b p-2">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleClearLogs}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
          <Button size="sm" variant="outline" onClick={handleCopyLogs}>
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
          <Button size="sm" variant="outline" onClick={handleDownloadLogs}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{logs.length} lines</span>
          {isRunning && (
            <span className="flex items-center gap-2 text-sm text-primary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              Live
            </span>
          )}
        </div>
      </div>

      {/* Console output */}
      <div
        ref={consoleRef}
        className="flex-1 overflow-auto bg-black/50 p-4 font-mono text-sm"
        onClick={() => inputRef.current?.focus()}
      >
        {logs.length === 0 ? (
          <div className="text-muted-foreground">
            {isRunning
              ? 'Waiting for server output...'
              : 'Start the server to see console output'}
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map((log, index) => (
              <div key={index} className={getLogColor(log.level)}>
                <span className="text-muted-foreground">
                  [{new Date(log.timestamp).toLocaleTimeString()}]
                </span>{' '}
                {log.message}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Command input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              ref={inputRef}
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isRunning ? 'Enter command... (Press ↑↓ for history)' : 'Server not running'
              }
              disabled={!isRunning}
              className="font-mono"
            />
          </div>
          <Button onClick={handleSendCommand} disabled={!isRunning || !command.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick commands */}
        {isRunning && (
          <div className="mt-2 flex flex-wrap gap-2">
            {['list', 'help', 'save-all', 'whitelist list', 'op'].map((cmd) => (
              <Button
                key={cmd}
                size="sm"
                variant="outline"
                onClick={() => {
                  setCommand(cmd)
                  inputRef.current?.focus()
                }}
              >
                {cmd}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
