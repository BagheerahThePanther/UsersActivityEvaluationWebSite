import React, { Component } from 'react';

export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor(props) {
      super(props);
      this.addRow = this.addRow.bind(this);
      this.setInEditMode = this.setInEditMode.bind(this);
      this.setUserId = this.setUserId.bind(this);
      this.setDateRegistration = this.setDateRegistration.bind(this);
      this.setDateLastActivity = this.setDateLastActivity.bind(this);
      this.saveTable = this.saveTable.bind(this);

      this.state = {
          rows: [],
          loading: false,
          inEditMode: {
              status: false,
              rowKey: null,
          },
          editingId: null,
          editingDateRegistration: null,
          editingDateLastActivity: null,
      };
  }

    componentDidMount() {
      this.setState({ rows: [{ UserID: "1", DateRegistration: "21/07/2021", DateLastActivity: "21/07/2021" }] });
    }

    addRow() {
        if (this.state.rows.find(row => (row.UserID == "not set" || row.UserID == "")) === undefined) {
            var rowsNew = this.state.rows;
            rowsNew.push({ UserID: "not set", DateRegistration: "", DateLastActivity: "" });
            this.setState({ rows: rowsNew });
            console.log(this.state.rows);
        }
    }

    setInEditMode({ status, rowKey }) {
        this.setState({ inEditMode: { status: status, rowKey: rowKey } });
    }


    setUserId(newUserId) {
        this.setState({ editingId: newUserId });
    }

    setDateRegistration(newDate) {
        this.setState({ editingDateRegistration: newDate });
    }

    setDateLastActivity(newDate) {
        this.setState({ editingDateLastActivity: newDate });
    }

    saveTable() {
        sendUsersTable(rows);
    }


    render() {
        const {
            editingDateLastActivity,
            editingDateRegistration,
            editingId,
            rows,
            inEditMode,
        } = this.state;


      const onEdit = ({ id, dateRegistration, dateLastActivity }) => {
          this.setInEditMode({
              status: true,
              rowKey: id
          })
          this.setUserId(id);
          this.setDateRegistration(dateRegistration);
          this.setDateLastActivity(dateLastActivity);
      }

      const onSave = ({ oldId, newId, dateRegistration, dateLastActivity }) => {
          this.setState({ rows: rows.map(row => row.UserID == oldId ? ({ UserID: newId, DateRegistration: dateRegistration, DateLastActivity: dateLastActivity }) : row) });
          onCancel();
      }

      const onCancel = () => {
          this.setInEditMode({
              status: false,
              rowKey: null
          })
          this.setUserId(null);
          this.setDateRegistration(null);
          this.setDateLastActivity(null);
      }



      const usersTable = ( <div>
                <table className='table table-striped' aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th>UserID</th>
                            <th>Date Registration</th>
                      <th>Date Last Activity</th>
                      <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                          <tr key={row.UserID}>
                              <td>{inEditMode.status && inEditMode.rowKey === row.UserID ? (
                                  <input value={editingId}
                                      onChange={(event) => this.setUserId(event.target.value)}
                                  />
                              ) : (
                                  row.UserID
                              )
                              }</td>

                              <td>{inEditMode.status && inEditMode.rowKey === row.UserID ? (
                                  <input value={editingDateRegistration}
                                      onChange={(event) => this.setDateRegistration(event.target.value)}
                                  />
                              ) : (
                                  row.DateRegistration
                              )
                              }</td>
                                  <td>{inEditMode.status && inEditMode.rowKey === row.UserID ? (
                                      <input value={editingDateLastActivity}
                                          onChange={(event) => this.setDateLastActivity(event.target.value)}
                                          />
                                      ) : (
                                          row.DateLastActivity
                                      )
                                  }</td>
                                  <td>
                                      {
                                      inEditMode.status && inEditMode.rowKey === row.UserID ? (
                                              <React.Fragment>
                                                  <button
                                                  className={"btn-success"}
                                                  onClick={() => onSave({ oldId: row.UserID, newId: editingId, dateRegistration: editingDateRegistration, dateLastActivity: editingDateLastActivity })}
                                                  >
                                                      Save
                                            </button>

                                                  <button
                                                      className={"btn-secondary"}
                                                      style={{ marginLeft: 8 }}
                                                      onClick={() => onCancel()}
                                                  >
                                                      Cancel
                                            </button>
                                              </React.Fragment>
                                          ) : (
                                              <button
                                                  className={"btn-primary"}
                                                  onClick={() => onEdit({ id: row.UserID, dateRegistration: row.DateRegistration, dateLastActivity: row.DateLastActivity })}
                                              >
                                                  Edit
                                              </button>
                                          )
                                      }
                                  </td>
                              </tr>
                          ))
                      }
                    </tbody>
                </table>
      </div >);

      let contents = this.state.loading
          ? <p><em>Loading...</em></p>
          : usersTable;

    return (
      <div>
        <h1 id="tabelLabel" >Users Activity Evaluation</h1>
        <p>Fill the table with users data, then click on button Save.</p>
            {contents}
            <button variant="primary" onClick={this.saveTable}>Save</button>{' '}
            <button onClick={this.addRow} variant="primary">Add row</button>{' '}

      </div>
    );
  }

    async sendUsersTable(rows) {
  // async populateWeatherData() {
    const response = await fetch('weatherforecast');
    const data = await response.json();
    this.setState({ forecasts: data, loading: false });
  }
}
