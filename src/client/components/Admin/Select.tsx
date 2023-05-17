import React from 'react'
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import { InfoType, Locales, Question, Recommendation } from '../../types'

type HandleChange = (event: SelectChangeEvent) => void

const recommendationTypes: InfoType[] = [
  {
    id: 'teaching',
    title: {
      fi: 'Opetus',
      sv: 'Opetus',
      en: 'Teaching',
    },
  },
  {
    id: 'administration',
    title: {
      fi: 'Hallinto',
      sv: 'Hallinto',
      en: 'Adminisitration',
    },
  },
]

const allSelection: InfoType = {
  id: 'allDimensions',
  title: {
    fi: 'Kaikki',
    sv: 'All',
    en: 'All',
  },
}

const languages = [
  {
    id: 'en',
    title: {
      fi: 'englanti',
      sv: 'engelska',
      en: 'English',
    },
  },
  {
    id: 'sv',
    title: {
      fi: 'ruotsi',
      sv: 'svenska',
      en: 'Swedish',
    },
  },
]

const SelectWrapper = ({
  label,
  value,
  handleChange,
  children,
}: {
  label: string
  value: string
  handleChange: HandleChange
  children: React.ReactNode
}) => (
  <Box sx={{ width: '20vw', mx: 4 }}>
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select label={label} value={value} onChange={handleChange}>
        {children}
      </Select>
    </FormControl>
  </Box>
)

const DialogSelectWrapper = ({
  label,
  value,
  handleChange,
  children,
}: {
  label: string
  value: string
  handleChange: HandleChange
  children: React.ReactNode
}) => (
  <FormControl fullWidth sx={{ mt: 4 }}>
    <InputLabel>{label}</InputLabel>
    <Select size="medium" label={label} value={value} onChange={handleChange}>
      {children}
    </Select>
  </FormControl>
)

const sortDimensions = (dimensions: InfoType[], language: keyof Locales) => {
  const sortedDimensions = dimensions.sort((a, b) => {
    if (a.title[language] > b.title[language]) return 1
    if (a.title[language] < b.title[language]) return -1

    return 0
  })

  return sortedDimensions
}

export const DimensionSelect = ({
  dimensionId,
  dimensions,
  handleChange,
}: {
  dimensionId: string
  dimensions: InfoType[]
  handleChange: HandleChange
}) => {
  const { t, i18n } = useTranslation()
  const language = i18n.language as keyof Locales

  const sortedDimensions = sortDimensions(dimensions, language)
  const dimensionSelections = [allSelection].concat(sortedDimensions)

  return (
    <SelectWrapper
      label={t('admin:selectDimension')}
      value={dimensionId}
      handleChange={handleChange}
    >
      {dimensionSelections.map(({ id, title }) => (
        <MenuItem key={id} value={id}>
          {title[language]}
        </MenuItem>
      ))}
    </SelectWrapper>
  )
}

const sortQuestions = (questions: Question[], language: keyof Locales) => {
  const sortedQuestions = questions.sort((a, b) => {
    if (a.title[language] > b.title[language]) return 1
    if (a.title[language] < b.title[language]) return -1

    return 0
  })

  return sortedQuestions
}

export const QuestionSelect = ({
  questionId,
  questions,
  handleChange,
}: {
  questionId: string
  questions: Question[]
  handleChange: HandleChange
}) => {
  const { t, i18n } = useTranslation()
  const language = i18n.language as keyof Locales

  const filteredQuestions = questions.filter(
    ({ optionData }) => !['dimensions', 'info'].includes(optionData.type)
  )
  const sortedQuestions = sortQuestions(filteredQuestions, language)

  return (
    <SelectWrapper
      label={t('admin:selectQuestion')}
      value={questionId}
      handleChange={handleChange}
    >
      {sortedQuestions.map(({ id, title }) => (
        <MenuItem key={id} value={id}>
          {title[language]}
        </MenuItem>
      ))}
    </SelectWrapper>
  )
}

export const RecommendationSelect = ({
  recommendationId,
  recommendations,
  handleChange,
}: {
  recommendationId: string
  recommendations: Recommendation[]
  handleChange: HandleChange
}) => {
  const { t, i18n } = useTranslation()
  const language = i18n.language as keyof Locales

  return (
    <SelectWrapper
      label={t('admin:selectRecommendation')}
      value={recommendationId}
      handleChange={handleChange}
    >
      {recommendations.map(({ id, title }) => (
        <MenuItem key={id} value={id}>
          {title[language]}
        </MenuItem>
      ))}
    </SelectWrapper>
  )
}

export const RecommendationTypeSelect = ({
  typeId,
  handleChange,
}: {
  typeId: string
  handleChange: HandleChange
}) => {
  const { t, i18n } = useTranslation()
  const language = i18n.language as keyof Locales

  return (
    <DialogSelectWrapper
      label={t('admin:selectRecommendationType')}
      value={typeId}
      handleChange={handleChange}
    >
      {recommendationTypes.map(({ id, title }) => (
        <MenuItem key={id} value={id}>
          {title[language]}
        </MenuItem>
      ))}
    </DialogSelectWrapper>
  )
}

export const LanguageSelect = ({
  selectedLanguage,
  handleChange,
}: {
  selectedLanguage: keyof Locales
  handleChange: HandleChange
}) => {
  const { t, i18n } = useTranslation()
  const language = i18n.language as keyof Locales

  return (
    <Box sx={{ width: '20vw' }}>
      <FormControl fullWidth>
        <FormLabel>{t('admin:selectLanguage')}</FormLabel>
        <RadioGroup defaultValue="en" onChange={handleChange} row>
          {languages.map(({ id, title }) => (
            <FormControlLabel
              key={id}
              value={id}
              control={<Radio />}
              label={title[language]}
              checked={selectedLanguage === id}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  )
}