import React, { BaseSyntheticEvent, useState } from 'react'
import { Box, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { InputProps } from '../../types'
import SelectFaculty from './SelectFaculty'
import RenderQuestions from './RenderQuestions'
import styles from './styles'

const RenderSurvey = ({
  control,
  watch,
  questions,
  handleSubmit,
}: InputProps) => {
  const { t, i18n } = useTranslation()
  const classes = styles.cardStyles
  const [disableForm, setDisableForm] = useState(false)
  const [showQuestions, setShowQuestions] = useState(false)

  if (!questions) return null

  const { language } = i18n

  const canProceed = (): boolean => {
    const dimensionQuestion = questions.find(
      (question) => question.optionData.type === 'dimensions'
    )

    const dimensionQuestionId = dimensionQuestion.id.toString()

    const isFacultySelected = watch('faculty') !== ''

    const isAnyDimensionsSelected =
      watch(dimensionQuestionId) &&
      Object.values(watch(dimensionQuestionId)).some((selected) => selected)

    return isFacultySelected && isAnyDimensionsSelected
  }

  const submitFormData = (event: BaseSyntheticEvent) => {
    setDisableForm(true)
    handleSubmit(event)
  }

  return (
    <Box sx={{ mx: 2, maxWidth: 1080, border: 1, borderColor: 'grey.300' }}>
      <SelectFaculty control={control} />
      <Box sx={classes.card} justifyContent="center">
        {questions.map((question) => (
          <div key={question.id}>
            {question.parentId === null && question.priority === 0 && (
              <RenderQuestions
                control={control}
                watch={watch}
                question={question}
                questions={questions}
                language={language}
              />
            )}

            {showQuestions &&
              question.parentId === null &&
              question.priority !== 0 && (
                <RenderQuestions
                  control={control}
                  watch={watch}
                  question={question}
                  questions={questions}
                  language={language}
                />
              )}
          </div>
        ))}

        <Box textAlign="center">
          {!showQuestions ? (
            <Button
              data-cy="open-form-button"
              disabled={!canProceed()}
              onClick={() => setShowQuestions(true)}
            >
              {t('openForm')}
            </Button>
          ) : (
            <Button
              data-cy="submit-form-button"
              disabled={disableForm}
              onClick={submitFormData}
            >
              {t('submit')}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default RenderSurvey
