import { IndexPath, Select, SelectItem } from "@ui-kitten/components";
import { MONTH_LABELS } from "../../utils/stringUtils";
import { Dispatch, SetStateAction } from "react";

const CURRENT_YEAR = new Date().getUTCFullYear();

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const fillDaysOfMonth = (year: number, month: number): number[] => {
  const days = [];
  const monthDaysQuantity = getDaysInMonth(year, month);

  for (let iterableDay = monthDaysQuantity; iterableDay >= 1; iterableDay--) {
    days.push(iterableDay);
  }

  return days;
};

const fillYearList = (): number[] => {
  const years = [];

  for (let iterableYear = CURRENT_YEAR; iterableYear >= 1980; iterableYear--) {
    years.push(iterableYear);
  }

  return years;
};

export const YEAR_LABELS = fillYearList();

interface DatePickerProps {
  selectedLabel: string | number;
  index: IndexPath;
  setIndex: Dispatch<SetStateAction<IndexPath>>;
  year?: number;
  month?: number;
  width?: string;
}

export const DayPicker = (props: DatePickerProps) => {
  return (
    <Select
      placeholder="Dia"
      value={props.selectedLabel}
      selectedIndex={props.index}
      onSelect={(index: IndexPath) => {
        props.setIndex(index);
      }}
      style={{ width: props.width }}
    >
      {fillDaysOfMonth(props.year!, props.month!).map((day, index) => (
        <SelectItem title={day} key={index} />
      ))}
    </Select>
  );
};

export const MonthPicker = (props: DatePickerProps) => {
  return (
    <Select
      placeholder="Mês"
      value={props.selectedLabel}
      selectedIndex={props.index}
      onSelect={(index: IndexPath) => {
        props.setIndex(index);
      }}
      style={{ width: props.width }}
    >
      {MONTH_LABELS.map((month, index) => (
        <SelectItem title={month} key={index} />
      ))}
    </Select>
  );
};

export const YearPicker = (props: DatePickerProps) => {
  return (
    <Select
      placeholder="Ano"
      value={props.selectedLabel}
      selectedIndex={props.index}
      onSelect={(index: IndexPath) => {
        props.setIndex(index);
      }}
      style={{ width: props.width }}
    >
      {YEAR_LABELS.map((day, index) => (
        <SelectItem title={day} key={index} />
      ))}
    </Select>
  );
};
