import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "#/components/ui/button"
import { Calendar } from "#/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "#/components/ui/popover"
import { cn } from "#/lib/utils"

type DateFieldProps = {
  name: string
  label?: string
  value: string
  onChange: (value: string) => void
  error?: string
  placeholder?: string
}

export default function DateField({ name, label, value, onChange, error, placeholder = "Pick a date" }: DateFieldProps) {
  const date = value ? new Date(value + "T00:00:00") : undefined

  function handleSelect(d: Date | undefined) {
    if (d) {
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, "0")
      const day = String(d.getDate()).padStart(2, "0")
      onChange(`${y}-${m}-${day}`)
    }
  }

  return (
    <div className="space-y-1">
      {label && <label htmlFor={name} className="text-sm font-medium">{label}</label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={name}
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              error && "border-destructive"
            )}
          >
            <CalendarIcon className="mr-2 size-4" />
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
