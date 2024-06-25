import React from 'react'

function ContentCheckbox({isComplete}) {
  return (
    <div className={`content__circle ${isComplete} ? "active" : ""`} />
  )
}

export default ContentCheckbox