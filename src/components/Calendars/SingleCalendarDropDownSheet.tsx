import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useDrag } from "@use-gesture/react";
import { Calendar } from "@/components/ui/calendar";
import { addMonths, format, subMonths } from "date-fns";

export function SingleCalendarMobileSheet({
  open,
  setOpen,
  applyDate,
  initialDate,
  title = "Custom select chose",
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  applyDate: (date: Date) => void;
  initialDate?: Date;
  title?: string;
}) {
  const [month, setMonth] = useState(new Date());
  const [selected, setSelected] = useState<Date | undefined>(initialDate);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelected(initialDate);
  }, [initialDate]);

  // Свайп на календаре — вправо/влево
  useDrag(
    ({ down, swipe }) => {
      if (!down) {
        const [swipeX] = swipe;
        if (swipeX === -1) setMonth(addMonths(month, 1)); // swipe left
        if (swipeX === 1) setMonth(subMonths(month, 1)); // swipe right
      }
    },
    {
      target: calendarRef,
      axis: "x",
      swipe: {
        distance: [50, 0], // 50px по оси X
      },
      filterTaps: true,
      pointer: {
        touch: true,
      },
    }
  );

  if (!open) return null;

  return (
    <>
      <div className='fixed inset-0 bg-[rgba(24,61,105,0.5)] z-[999] pt-4' />
      <motion.div
        drag='y'
        dragMomentum={false}
        onDragEnd={(e, info) => {
          if (info.offset.y > 60) setOpen(false);
        }}
        onUpdate={(latest) => {
          if (latest.y < 0) {
            latest.y = 0;
          }
        }}
        className='fixed inset-x-0 bottom-0 z-[1000] bg-white rounded-t-2xl min-h-[400px] overflow-y-auto shadow-xl cursor-grab p-4 w-full max-w-screen-sm mx-auto'
        style={{ paddingTop: "16px" }}
      >
        <div className='flex flex-col gap-6'>
          <div className='flex justify-center mt-4'>
            <div className='h-1.5 w-10 rounded-full bg-gray-300 mx-auto mb-4' />
          </div>

          <h3 className='text-center text-base font-semibold text-gray-800'>
            {title}
          </h3>

          <div className='flex items-center justify-around px-2 pt-2'>
            <button
              type='button'
              className='text-[#17BA68] font-bold'
              onClick={() => setMonth(subMonths(month, 1))}
            >
              <img src='../../src/assets/icons/left-arrow.svg' alt='' />
            </button>

            <span className='text-[#183D69] font-medium text-base'>
              {month
                .toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })
                .replace(/^\w/, (c) => c.toUpperCase())}
            </span>

            <button
              type='button'
              className='text-[#17BA68] font-bold'
              onClick={() => setMonth(addMonths(month, 1))}
            >
              <img src='../../src/assets/icons/right-arrow.svg' alt='' />
            </button>
          </div>

          <div className='flex justify-center' ref={calendarRef}>
            <Calendar
              month={month}
              onMonthChange={setMonth}
              mode='single'
              selected={selected}
              onSelect={setSelected}
              weekStartsOn={1}
              className='
                rounded-xl px-4 py-3 text-sm text-[#183D69]
                [&_.rdp-nav]:hidden
                [&_button:hover]:bg-[#CDF5D8] [&_button:hover]:text-[#17BA68]
                [&_.selected]:bg-[#CDF5D8] [&_.selected]:text-[#17BA68]
                [&_.rdp-head_cell]:text-[#183D69] [&_.rdp-head_cell]:font-medium
              '
            />
          </div>

          {selected && (
            <div className='text-center text-sm font-medium text-[#183D69]'>
              {format(selected, "d MMMM yyyy")}
            </div>
          )}

          <button
            className='calendar-select-btn'
            disabled={!selected}
            onClick={() => {
              if (selected) {
                applyDate(selected);
                setOpen(false);
              }
            }}
          >
            Select
          </button>
        </div>
      </motion.div>
    </>
  );
}
