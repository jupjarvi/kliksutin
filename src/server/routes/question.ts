import express from 'express'

import { RequestWithUser } from '../types'
import { Question } from '../db/models'

const questionRouter = express.Router()

questionRouter.get('/:surveyId', async (req, res) => {
  const { surveyId } = req.params

  const questions = await Question.findAll({
    where: {
      surveyId,
    },
  })

  return res.send(questions)
})

questionRouter.put('/:id', async (req: RequestWithUser, res) => {
  const { id } = req.params
  const { isAdmin } = req.user

  if (!isAdmin) throw new Error('Unauthorized')

  const question = await Question.findByPk(id)

  if (!question) throw new Error('Question not found')

  const updates = req.body

  console.log(updates)

  /* Object.assign(result, updates)
  await result.save() */

  return res.send(updates)
})

export default questionRouter