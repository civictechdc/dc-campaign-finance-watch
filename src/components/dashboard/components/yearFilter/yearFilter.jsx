import React, {Component} from 'react'

function YearFilter() {
  return (
    <div>
    Viewing Years:
    <select name="years" onChange={(evt) => this._changeYearsViewed(evt.target.value)}>
        <option value="14-16">2014 - 2016</option>
        <option value="12-14">2012 - 2014</option>
        <option value="10-12">2010 - 2012</option>
        <option value="08-10">2008 - 2010</option>
    </select>
    </div>
  )
}

export default YearFilter
