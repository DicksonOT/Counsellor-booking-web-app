import React from 'react'
import UserAssessmentProgress from '../components/Assessment'
import MoodHistory from '../components/MoodHistory'

const Assessments = () => {
  return (
<main className='grid grid-cols-1 md:grid-cols-2 gap-6 p-6'>
  <section aria-label="Assessment Progress">
    <UserAssessmentProgress />
  </section>
  <section aria-label="Mood History">
    <MoodHistory/>
  </section>
</main>
  )
}

export default Assessments