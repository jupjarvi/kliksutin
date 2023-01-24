import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, Grid } from '@mui/material'
import { useForm } from 'react-hook-form'

import CourseSize from './CourseSize'
import CourseType from './CourseType'
import CourseAttendance from './CourseAttendance'
import CourseRecord from './CourseRecord'
import CourseMethods from './CourseMethods'
import CourseGrading from './CourseGrading'
import SelectFaculty from './SelectFaculty'
import Recommendations from './Recommendations'

const Form = () => {
  const [faculties, setFaculties] = useState(null)

  const { handleSubmit, control, watch } = useForm({
    mode: 'onBlur',
    shouldUnregister: true,
    defaultValues: {
      faculty: '',
      courseAttendanceType: '',
      courseAttendants: {
        size: '',
        courseIsMooc: '',
      },
      courseCompletionMethod: '',
      courseGrading: '',
      courseLectures: '',
      lectureRecording: '',
    },
  })
  const onSubmit = (data: any) => {
    const submittedData = data
    // eslint-disable-next-line
    console.log(submittedData)
  }

  useEffect(() => {
    axios
      .get('/api/faculties')
      .then((facultyData) => setFaculties(facultyData.data))
  }, [])

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      <Grid item xs={8}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <SelectFaculty control={control} faculties={faculties} />
          <CourseSize control={control} watch={watch} />
          <CourseType control={control} />
          <CourseAttendance control={control} watch={watch} />
          <CourseRecord control={control} watch={watch} />
          <CourseMethods control={control} watch={watch} />
          <CourseGrading control={control} />
          <Button onClick={handleSubmit(onSubmit)}>Submit</Button>
        </form>
      </Grid>
      <Grid item xs={4}>
        <Recommendations />
      </Grid>
    </Grid>
  )
}

export default Form
