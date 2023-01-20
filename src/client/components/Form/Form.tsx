import React from 'react'
import { Button, Container } from '@mui/material'
import { useForm } from 'react-hook-form'

import CourseSize from './CourseSize'
import CourseType from './CourseType'
import CourseAttendance from './CourseAttendance'
import CourseRecord from './CourseRecord'
import CourseMethods from './CourseMethods'
import CourseGrading from './CourseGrading'

const Form = () => {
  const { handleSubmit, control, watch } = useForm({
    mode: 'onBlur',
    shouldUnregister: true,
    defaultValues: {
      courseAttendanceType: '',
      courseAttendants: '',
      courseCompletionMethod: '',
      courseGrading: '',
      courseLectures: '',
      lectureRecording: '',
      courseIsMooc: 'false',
    },
  })
  const onSubmit = (data: any) => {
    const submittedData = data

    console.log(submittedData)
  }
  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CourseSize control={control} watch={watch} />
        <CourseType control={control} />
        <CourseAttendance control={control} watch={watch} />
        <CourseRecord control={control} watch={watch} />
        <CourseMethods control={control} watch={watch} />
        <CourseGrading control={control} />
        <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
      </form>
    </Container>
  )
}

export default Form
