import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Container, Typography } from '@mui/material'

import useSurvey from '../../hooks/useSurvey'
import useResults from '../../hooks/useResults'
import styles from './styles'
import { FormValues, Locales, Result } from '../../types'
import SendSummaryEmail from './SendSummaryEmail'

const classes = styles.cardStyles

const ResultElement = ({
  language,
  resultData,
  dimensions,
}: {
  language: keyof Locales
  resultData: Result
  dimensions: string[]
}) => {
  if (!resultData || !dimensions) return null

  return (
    <Container sx={classes.resultContainer}>
      <Typography variant="h6" sx={classes.heading} component="div">
        {resultData.isSelected[language]}
      </Typography>
      <Box sx={classes.content}>
        {dimensions.map((dimension: string) => (
          <Typography
            key={`${JSON.stringify(resultData)}.${dimension}`}
            variant="body2"
          >
            {resultData.data[dimension][language]}
          </Typography>
        ))}
      </Box>
    </Container>
  )
}

const Results = ({ formResultData }: { formResultData: FormValues }) => {
  const { t, i18n } = useTranslation()
  const { survey } = useSurvey()
  const { results, isSuccess: resultsFetched } = useResults(survey?.id)
  const { language } = i18n

  if (!resultsFetched || !formResultData) return null

  const dimensionQuestion = survey.Questions.find(
    (question) => question.optionData.type === 'dimensions'
  )
  const dimensionQuestionId = dimensionQuestion.id

  const courseCompletionMethodQuestion = survey.Questions.find(
    (question) => question.title.fi === 'Suoritusmuoto'
  )
  const courseCompletionMethodId = courseCompletionMethodQuestion.id

  const isAllDimensionsSelected: boolean = Object.values(
    formResultData[dimensionQuestionId]
  ).every((dimension) => dimension)

  const multipleChoiceObjectToArray = (aChoiceId: number): string[] =>
    Object.keys(formResultData[aChoiceId]).filter(
      (index) => formResultData[aChoiceId][index]
    )

  const modifiedResultObject = {
    ...formResultData,
    [dimensionQuestionId]: isAllDimensionsSelected
      ? ['allDimensions']
      : multipleChoiceObjectToArray(dimensionQuestionId),
    [courseCompletionMethodId]: multipleChoiceObjectToArray(
      courseCompletionMethodId
    ),
  }

  const resultArray: string[][] = Object.values(modifiedResultObject)
    .slice(1)
    .filter((x) => x !== '')
    .map((result: string | Array<string>) =>
      typeof result === 'string' ? [result] : result
    )

  return (
    <Box id="result-component" sx={classes.outerBox}>
      <Container sx={{ mt: 2 }}>
        <Typography variant="h5" sx={classes.heading} component="div">
          {t('results:title')}
        </Typography>
      </Container>

      {resultArray.map((resultLabels) =>
        resultLabels.map((resultLabel) => (
          <ResultElement
            key={JSON.stringify(resultLabel)}
            language={language as keyof Locales}
            resultData={results.find(
              (result: { optionLabel: string }) =>
                result.optionLabel === resultLabel
            )}
            dimensions={modifiedResultObject[dimensionQuestionId] as string[]}
          />
        ))
      )}

      <SendSummaryEmail />
    </Box>
  )
}

export default Results
