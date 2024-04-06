import React, { useState, useEffect } from 'react'

export default function Members() {

  const [showMembersData, setMembersData] = useState(false)
  const [data, setData] = useState([{}])

  //get members fetch
  useEffect(() => {
    fetch("/members").then(
      res => res.json()
    ).then(
      data => {
        setData(data)
        console.log(data)
      }
    )
  }, [])

  //members get gomb
  const handleMembersButtonClick = () => {
    if (showMembersData === true) {
      setMembersData(false)
    } else setMembersData(true)
  }


  return (
    <div className=' pt-4'>
      <div className="container shadow d-flex flex-column pt-4">
        <h2>Members</h2>
        <button type="button" className="btn btn-primary w-25 mb-3 mt-2" onClick={handleMembersButtonClick}>Lekérdezés</button>
        {
          showMembersData && <div className="container pt-3">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">First</th>
                </tr>
              </thead>
              <tbody>
                {(typeof data.members === 'undefined') ? (
                  <p>Loading...</p>
                ) : (
                  data.members.map((item, index) => (
                    <tr>
                      <th scope="row">{index + 1}</th>
                      <td>{item}</td>
                    </tr>
                  ))
                )}

              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  )
}
