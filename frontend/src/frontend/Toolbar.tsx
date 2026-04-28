import { Pencil, Eraser, Pipette, Paintbrush } from 'lucide-react';
import { PLAYER_COLORS } from '@/config/constants';
import type { Tool } from './GridCanvas';

interface ToolbarProps {
  tool: Tool;
  onToolChange: (t: Tool) => void;
  color: string;
  onColorChange: (c: string) => void;
}

const TOOLS: { id: Tool; label: string; icon: React.ComponentType<{ className?: string }>; hint: string }[] = [
  { id: 'paint', label: 'Pencil', icon: Pencil, hint: 'Click to claim a tile' },
  { id: 'brush', label: 'Brush', icon: Paintbrush, hint: 'Click + drag to paint multiple tiles' },
  { id: 'erase', label: 'Eraser', icon: Eraser, hint: 'Clear your own tiles' },
  { id: 'pick', label: 'Picker', icon: Pipette, hint: 'Sample a color from the grid' },
];

export function Toolbar({ tool, onToolChange, color, onColorChange }: ToolbarProps) {
  const active = TOOLS.find((t) => t.id === tool)!;
  return (
    <div className="glass flex flex-wrap items-center gap-3 rounded-2xl px-3 py-2.5">
      <div className="flex items-center gap-1 rounded-xl bg-card/40 p-1">
        {TOOLS.map((t) => {
          const Icon = t.icon;
          const isActive = t.id === tool;
          return (
            <button
              key={t.id}
              type="button"
              title={`${t.label} — ${t.hint}`}
              aria-label={t.label}
              aria-pressed={isActive}
              onClick={() => onToolChange(t.id)}
              className={[
                'group relative flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              ].join(' ')}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>

      <div className="hidden h-7 w-px bg-border sm:block" />

      <div className="flex items-center gap-1.5">
        {PLAYER_COLORS.map((c) => {
          const isActive = c === color;
          return (
            <button
              key={c}
              type="button"
              aria-label={`Color ${c}`}
              aria-pressed={isActive}
              onClick={() => onColorChange(c)}
              className={[
                'h-6 w-6 rounded-md transition-all duration-200 hover:scale-110',
                isActive ? 'ring-2 ring-offset-2 ring-offset-background' : '',
              ].join(' ')}
              style={{
                backgroundColor: c,
                boxShadow: isActive ? `0 0 12px ${c}` : `0 0 0 1px hsl(var(--border))`,
                ['--tw-ring-color' as string]: c,
              }}
            />
          );
        })}
      </div>

      <div className="ml-auto hidden items-center gap-2 md:flex">
        <Pencil className="h-3 w-3 text-muted-foreground" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {active.hint}
        </span>
      </div>
    </div>
  );
}
