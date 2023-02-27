import { Recommendation } from '../models'
import getDimensionData from '../../data/dimensions'

const seedRecommendations = async () => {
  const recommendations: any[] = getDimensionData()

  recommendations.forEach(async (recommendation) => {
    await Recommendation.upsert({
      ...recommendation,
    })
  })
}

export default seedRecommendations
