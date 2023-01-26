import { Control } from 'react-hook-form'

export interface InputProps {
  control: Control<any>
  watch?: any
}

export type FormValues = {
  faculty: String
  courseAttendanceType: String
  courseAttendants: {
    size: ''
    courseIsMooc?: String
  }
  courseCompletionMethod: String
  courseGrading: String
  courseLectures: String
  lectureRecording: String
}