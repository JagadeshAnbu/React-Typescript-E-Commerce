declare module 'react-datepicker' {
    import { Component } from 'react';
  
    interface ReactDatePickerProps {
      // Define only the properties you use if you don't want to specify all
      selected: Date | null;
      onChange: (date: Date | null, event: React.SyntheticEvent<any> | undefined) => void;
      showTimeSelect?: boolean;
      timeIntervals?: number;
      timeCaption?: string;
      dateFormat?: string;
      required?: boolean;
      placeholderText?: string;
    }
  
    export default class ReactDatePicker extends Component<ReactDatePickerProps, any> {}
  }
  