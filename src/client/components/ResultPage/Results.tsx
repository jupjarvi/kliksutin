import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import useSurvey from '../../hooks/useSurvey'
import useResults from '../../hooks/useResults'
import styles from './styles'
import { FormValues, Result } from '../../types'

const classes = styles.cardStyles

const EndingElement = () => {
  const { t } = useTranslation()

  return (
    <Box>
      <Container sx={{ mt: 12 }}>
        <Typography variant="h6" sx={classes.heading} component="div">
          {t('results:proceedTitle')}
        </Typography>
      </Container>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginBottom={4}
      >
        <Stack textAlign="center" direction="row" spacing={2}>
          <Button sx={classes.stackButton} variant="outlined">
            {t('results:proceedToExit')}
          </Button>

          <Button sx={classes.stackButton} variant="contained">
            {t('results:proceedToConsultation')}
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}

const ResultElement = ({
  resultData,
  dimensions,
}: {
  resultData: Result
  dimensions: string[]
}) => {
  if (!resultData || !dimensions) return null

  const language = localStorage.getItem('language') || 'en'

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
  const { t } = useTranslation()
  const survey = useSurvey()
  const results = useResults()

  if (!survey || !results || !formResultData) return null

  const dimensionQuestion = survey.Questions.find(
    (question) => question.optionData.type === 'dimensions'
  )

  const dimensionQuestionId = dimensionQuestion.id.toString()

  const courseCompletionMethodId = 4

  const isAllDimensionsSelected: boolean = Object.values(
    formResultData[dimensionQuestionId]
  ).every((dimension) => dimension)

  const arrayOfSelectedCompletionMethods = Object.keys(
    formResultData[courseCompletionMethodId]
  ).filter((method) => formResultData[courseCompletionMethodId][method])

  const mapSelectionsToObject = {
    ...formResultData,
    1: isAllDimensionsSelected
      ? ['allDimensions']
      : Object.keys(formResultData[dimensionQuestionId]).filter(
          (dimension) => formResultData[dimensionQuestionId][dimension]
        ),
    4: arrayOfSelectedCompletionMethods,
  }

  const mapSelectionsToArray = Object.values(mapSelectionsToObject)
    .slice(1)
    .filter((x) => x !== '')
    .map((result: string | Array<string>) =>
      typeof result === 'string' ? [result] : result
    )

  return (
    <Box sx={{ m: 2, maxWidth: 1080, border: 1, borderColor: 'grey.300' }}>
      <Container sx={{ mt: 2 }}>
        <Typography variant="h5" sx={classes.heading} component="div">
          {t('results:title')}
        </Typography>
      </Container>

      {mapSelectionsToArray.map((resultLabels) =>
        resultLabels.map((resultLabel) => (
          <ResultElement
            key={JSON.stringify(resultLabel)}
            resultData={results.find(
              (result: { optionLabel: string }) =>
                result.optionLabel === resultLabel
            )}
            dimensions={mapSelectionsToObject[dimensionQuestionId]}
          />
        ))
      )}

      <EndingElement />
    </Box>
  )
}

export default Results
