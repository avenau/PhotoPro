import { ChangeEvent } from "react";

export default interface FillinFormProps {
  title: string;
  //Name used for html
  id_name: string;
  onChange(event: React.ChangeEvent<HTMLSelectElement>): any;
}
