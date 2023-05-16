import React, { useState } from 'react'
import { Box, SelectChangeEvent, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

// import useSurvey from '../../../hooks/useSurvey'

import { LanguageSelect, QuestionSelect } from '../EditResults/Select'
import EditOptions from './EditOptions'
import EditQuestion from './EditQuestion'

import { Locales } from '../../../types'
import useQuestions from '../../../hooks/useQuestions'

const EditQuestions = () => {
  const { t } = useTranslation()
  const { questions, isLoading } = useQuestions(1)

  const [questionId, setQuestionId] = useState('')
  const handleQuestionChange = (event: SelectChangeEvent) => {
    setQuestionId(event.target.value)
  }

  const [selectedLanguage, setSelectedLanguage] = useState<keyof Locales>('en')
  const handleLanguageChange = (event: SelectChangeEvent) => {
    setSelectedLanguage(event.target.value as keyof Locales)
  }

  if (isLoading) return null

  const selectedQuestion = questions.find(
    ({ id }) => id === (questionId as unknown as number)
  )

  const options = selectedQuestion?.optionData.options || []

  return (
    <Box sx={{ mx: 2, mt: 8 }}>
      <Box sx={{ display: 'flex', my: 4, justifyContent: 'space-evenly' }}>
        <QuestionSelect
          questionId={questionId}
          questions={questions}
          handleChange={handleQuestionChange}
        />
        <LanguageSelect
          selectedLanguage={selectedLanguage}
          handleChange={handleLanguageChange}
        />
      </Box>
      {selectedQuestion && (
        <Box width="100%" flexWrap="wrap">
          <Box sx={{ my: 8 }}>
            <Typography sx={{ my: 4, pl: 1 }} variant="h4">
              {t('admin:questionViewInfo')}
            </Typography>
            <EditQuestion
              language={selectedLanguage}
              question={selectedQuestion}
            />
          </Box>
          <Box sx={{ my: 8 }}>
            <Typography sx={{ my: 4, pl: 1 }} variant="h4">
              {t('admin:questionOptionViewInfo')}
            </Typography>
            {options.map((option, index) => (
              <EditOptions
                key={option.id}
                option={option}
                optionNumber={index + 1}
                question={selectedQuestion}
                language={selectedLanguage}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default EditQuestions
