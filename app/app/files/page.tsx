"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Folder,
  File,
  FileText,
  FileCode,
  ImageIcon,
  Archive,
  ChevronRight,
  Search,
  Upload,
  FolderPlus,
  Download,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FileItem {
  id: string;
  name: string;
  type: "folder" | "file";
  extension?: string;
  size?: string;
  modified: string;
}

const mockFiles: FileItem[] = [
  { id: "1", name: "world", type: "folder", modified: "Today" },
  { id: "2", name: "world_nether", type: "folder", modified: "Today" },
  { id: "3", name: "world_the_end", type: "folder", modified: "Today" },
  { id: "4", name: "plugins", type: "folder", modified: "Yesterday" },
  { id: "5", name: "logs", type: "folder", modified: "Today" },
  { id: "6", name: "server.properties", type: "file", extension: "properties", size: "1.2 KB", modified: "Today" },
  { id: "7", name: "server.jar", type: "file", extension: "jar", size: "42.5 MB", modified: "3 days ago" },
  { id: "8", name: "bukkit.yml", type: "file", extension: "yml", size: "2.8 KB", modified: "Yesterday" },
  { id: "9", name: "spigot.yml", type: "file", extension: "yml", size: "4.1 KB", modified: "Yesterday" },
  { id: "10", name: "paper.yml", type: "file", extension: "yml", size: "12.3 KB", modified: "Yesterday" },
  { id: "11", name: "ops.json", type: "file", extension: "json", size: "256 B", modified: "2 days ago" },
  { id: "12", name: "whitelist.json", type: "file", extension: "json", size: "512 B", modified: "2 days ago" },
  { id: "13", name: "banned-players.json", type: "file", extension: "json", size: "128 B", modified: "5 days ago" },
  { id: "14", name: "eula.txt", type: "file", extension: "txt", size: "64 B", modified: "1 week ago" },
];

const servers = [
  { id: "1", name: "Survival World" },
  { id: "2", name: "Creative Build" },
  { id: "3", name: "Modded Adventure" },
];

export default function FilesPage() {
  const [selectedServer, setSelectedServer] = useState("1");
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const getFileIcon = (item: FileItem) => {
    if (item.type === "folder") return Folder;
    switch (item.extension) {
      case "yml":
      case "yaml":
      case "json":
      case "properties":
        return FileCode;
      case "txt":
      case "log":
        return FileText;
      case "png":
      case "jpg":
      case "gif":
        return ImageIcon;
      case "zip":
      case "tar":
      case "gz":
      case "jar":
        return Archive;
      default:
        return File;
    }
  };

  const filteredFiles = mockFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFileSelection = (id: string) => {
    setSelectedFiles((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const navigateToFolder = (folderName: string) => {
    setCurrentPath((prev) => [...prev, folderName]);
  };

  const navigateUp = () => {
    setCurrentPath((prev) => prev.slice(0, -1));
  };

  const navigateToPathIndex = (index: number) => {
    setCurrentPath((prev) => prev.slice(0, index + 1));
  };

  return (
    <>
      <AppHeader title="File Manager" />
      <div className="flex flex-1 flex-col overflow-hidden p-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Select value={selectedServer} onValueChange={setSelectedServer}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select server" />
              </SelectTrigger>
              <SelectContent>
                {servers.map((server) => (
                  <SelectItem key={server.id} value={server.id}>
                    {server.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9 bg-secondary"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <FolderPlus className="mr-2 h-4 w-4" />
              New Folder
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="mt-4 flex items-center gap-1 rounded-lg bg-secondary/50 px-3 py-2">
          <button
            type="button"
            onClick={() => setCurrentPath([])}
            className="text-sm font-medium text-primary hover:underline"
          >
            {servers.find((s) => s.id === selectedServer)?.name}
          </button>
          {currentPath.map((folder, index) => (
            <span key={`${folder}-${index}`} className="flex items-center">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <button
                type="button"
                onClick={() => navigateToPathIndex(index)}
                className="text-sm font-medium text-primary hover:underline"
              >
                {folder}
              </button>
            </span>
          ))}
        </div>

        {/* File List */}
        <div className="mt-4 flex-1 overflow-y-auto rounded-xl border border-border bg-card">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 border-b border-border bg-secondary/30 px-4 py-3 text-xs font-medium text-muted-foreground">
            <div className="col-span-6">Name</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-3">Modified</div>
            <div className="col-span-1" />
          </div>

          {/* Files */}
          <div className="divide-y divide-border">
            {currentPath.length > 0 && (
              <button
                type="button"
                onClick={navigateUp}
                className="grid w-full grid-cols-12 gap-4 px-4 py-3 text-left transition-colors hover:bg-secondary/30"
              >
                <div className="col-span-6 flex items-center gap-3">
                  <Folder className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-foreground">..</span>
                </div>
                <div className="col-span-2" />
                <div className="col-span-3" />
                <div className="col-span-1" />
              </button>
            )}
            {filteredFiles.map((file) => {
              const FileIcon = getFileIcon(file);
              const isSelected = selectedFiles.includes(file.id);

              return (
                <div
                  key={file.id}
                  className={cn(
                    "grid grid-cols-12 gap-4 px-4 py-3 transition-colors hover:bg-secondary/30",
                    isSelected && "bg-primary/10"
                  )}
                >
                  <div className="col-span-6 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleFileSelection(file.id)}
                      className="h-4 w-4 rounded border-border"
                    />
                    <FileIcon
                      className={cn(
                        "h-5 w-5",
                        file.type === "folder"
                          ? "text-yellow-500"
                          : "text-muted-foreground"
                      )}
                    />
                    {file.type === "folder" ? (
                      <button
                        type="button"
                        onClick={() => navigateToFolder(file.name)}
                        className="text-sm text-foreground hover:text-primary hover:underline"
                      >
                        {file.name}
                      </button>
                    ) : (
                      <span className="text-sm text-foreground">{file.name}</span>
                    )}
                  </div>
                  <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                    {file.size || "-"}
                  </div>
                  <div className="col-span-3 flex items-center text-sm text-muted-foreground">
                    {file.modified}
                  </div>
                  <div className="col-span-1 flex items-center justify-end gap-1">
                    {file.type === "file" && (
                      <>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selection Actions */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
            <span className="text-sm text-muted-foreground">
              {selectedFiles.length} item(s) selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
