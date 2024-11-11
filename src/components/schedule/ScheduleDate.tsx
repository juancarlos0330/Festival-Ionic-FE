import React from "react";
import "../styles/Schedule.css";

type ScheduleDatePropsType = {
  date: string;
};

interface props {
  item: ScheduleDatePropsType;
}

const ScheduleDate: React.FC<props> = ({ item }: props) => {
  return (
    <div className="schedule-date-view">
      <div>{item.date}</div>
    </div>
  );
};

export default ScheduleDate;
