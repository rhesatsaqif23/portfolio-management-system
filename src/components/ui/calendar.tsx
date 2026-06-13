import { DayPicker } from "react-day-picker"

type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={className}
      classNames={{
        months: "relative",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "flex items-center absolute top-0 right-0 gap-1",
        button_previous: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        button_next: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        day: "h-9 w-9 text-center text-sm p-0 relative rounded-md hover:bg-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-selected:opacity-100",
        day_today: "bg-accent text-accent-foreground",
        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus-visible:bg-primary focus-visible:text-primary-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  )
}

export { Calendar }
