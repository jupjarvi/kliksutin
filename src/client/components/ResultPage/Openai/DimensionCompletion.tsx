import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { UseFormWatch, FieldValues } from 'react-hook-form'
import { enqueueSnackbar } from 'notistack'

import useOpenaiCompletion from '../../../hooks/useOpenaiCompletion'
import useSurvey from '../../../hooks/useSurvey'
import LoadingProgress from './LoadingProgress'
import { getSelectedDimensions } from '../../../util/dimensions'
import styles from '../../../styles'
import { DimensionSelectionData, Locales } from '../../../types'

const { cardStyles } = styles

const CompletionResult = ({
  dimension,
  setShowCompletion,
}: {
  dimension: DimensionSelectionData
  setShowCompletion: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const { t, i18n } = useTranslation()

  const { label, data } = dimension

  const dimensionName = label[i18n.language as keyof Locales].toLowerCase()

  const recommendationNames = data.map(
    ({ name }) => name.charAt(0).toUpperCase() + name.slice(1)
  )
  const recommendations =
    recommendationNames.slice(0, -1).join(', ') +
    t('openai:or') +
    recommendationNames.slice(-1)

  const prompt = t('openai:dimensionCompletionPrompt', {
    dimensionName,
    recommendations,
  })

  const { completion, isLoading } = useOpenaiCompletion(prompt, 'dimension')

  if (isLoading) return <LoadingProgress />

  if (!completion) {
    enqueueSnackbar(t('openai:apiErrorMessage'), { variant: 'error' })
    setShowCompletion(false)

    return null
  }

  return (
    <Box sx={cardStyles.answerBox}>
      <Typography variant="body1" sx={cardStyles.content} whiteSpace="pre-line">
        {completion.trim()}
      </Typography>
    </Box>
  )
}

const DimensionCompletion = ({
  watch,
}: {
  watch: UseFormWatch<FieldValues>
}) => {
  const { t, i18n } = useTranslation()
  const { language } = i18n
  const [dimensionId, setdimensionId] = useState('')
  const [showCompletion, setShowCompletion] = useState(false)
  const { survey, isLoading } = useSurvey()

  if (isLoading) return null

  const dimensions = getSelectedDimensions(survey, watch)

  return (
    <Box sx={cardStyles.nestedSubSection}>
      <Typography variant="body2">
        {t('openai:selectDimensionInfoText')}
      </Typography>
      <Box sx={cardStyles.content}>
        <FormControl size="small" sx={cardStyles.inputField}>
          <InputLabel>{t('openai:dimensionSelect')}</InputLabel>
          <Select
            data-cy="dimension-completion-select"
            value={dimensionId}
            label={t('openai:dimensionSelect')}
            onChange={({ target }) => setdimensionId(target.value)}
            disabled={showCompletion}
          >
            {dimensions.map((d) => (
              <MenuItem
                data-cy={`dimension-option-${d.id}`}
                key={d.id}
                value={d.id}
              >
                {d.label[language as keyof Locales]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box sx={{ my: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowCompletion(true)}
            disabled={showCompletion || dimensionId.length === 0}
          >
            {t('openai:send')}
          </Button>
        </Box>
        {showCompletion && dimensions.find(({ id }) => id === dimensionId) && (
          <CompletionResult
            dimension={dimensions.find(({ id }) => id === dimensionId)}
            setShowCompletion={setShowCompletion}
          />
        )}
      </Box>
    </Box>
  )
}

export default DimensionCompletion
