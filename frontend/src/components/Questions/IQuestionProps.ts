import { ChangeEvent } from "react";

export default interface IQuestionProps {
  question: string;
  //Name used for html
  name: string;
  onChange(event: React.ChangeEvent<HTMLSelectElement>): any;
}
