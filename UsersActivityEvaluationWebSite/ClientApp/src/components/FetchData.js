import React, { Component } from 'react';
import { Chart } from "react-google-charts";

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
      this.showHistogram = this.showHistogram.bind(this);
      this.showRollingRetention = this.showRollingRetention.bind(this);

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
          displayRollingRetention: false,
          displayHistogram: false,
          histogramData: null,
          rollingRetention: null,
      };
  }

    componentDidMount() {
      this.getUsersData();
      this.setState({ rows: [{ UserID: "1", DateRegistration: "21.07.2021", DateLastActivity: "21.07.2021" }] });
    }

    addRow() {
        if (this.state.rows.find(row => (row.UserID == "not set" || row.UserID == "")) === undefined) {
            var rowsNew = this.state.rows;
            rowsNew.push({ UserID: "not set", DateRegistration: "", DateLastActivity: "" });
            this.setState({ rows: rowsNew });
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
        if (this.state.rows.find(row => row.UserID === null || row.UserID === "" ||
            row.DateRegistration === null || row.DateRegistration === "" ||
            row.DateLastActivity === null || row.DateLastActivity === "") === undefined) {

            function toDate(dateStr) {
                var parts = dateStr.split(".")
                return new Date(parts[2], parts[1] - 1, parseInt(parts[0]) + 1)
            }

            this.sendUsersTable(JSON.stringify(this.state.rows.map(row => ({
                UserID: row.UserID,
                DateRegistration: (toDate(row.DateRegistration)).toISOString(),
                DateLastActivity: (toDate(row.DateLastActivity)).toISOString(),
            }))));
        }
    }

    showHistogram() {
        this.getLifetimeHistogram();
        this.setState({ displayHistogram: true });
    }

    showRollingRetention() {
        this.getRollingRetention(7);
        this.setState({ displayRollingRetention: true });
    }


    render() {
        const {
            editingDateLastActivity,
            editingDateRegistration,
            editingId,
            rows,
            inEditMode,
            displayRollingRetention,
            displayHistogram,
            histogramData,
            rollingRetention,
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
            if (!rows.find(row => row.UserID === newId && newId !== oldId)) {
                this.setState({ rows: rows.map(row => row.UserID == oldId ? ({ UserID: newId, DateRegistration: dateRegistration, DateLastActivity: dateLastActivity }) : row) });
            }
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
        const onDelete = ({ id }) => {
            this.setState({ rows: rows.filter(row => row.UserID != id) });
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
                                                  className={"btn-table-save"}
                                                  onClick={() => onSave({ oldId: row.UserID, newId: editingId, dateRegistration: editingDateRegistration, dateLastActivity: editingDateLastActivity })}
                                                  >
                                                  <span>Save</span>
                                            </button>

                                                  <button
                                                  className={"btn-table-edit"}
                                                      style={{ marginLeft: 8 }}
                                                      onClick={() => onCancel()}
                                                  >
                                                  <span>Cancel</span>
                                            </button>
                                              </React.Fragment>
                                      ) : (
                                              <React.Fragment>
                                              <button
                                                  className={"btn-table-edit"}
                                                  onClick={() => onEdit({ id: row.UserID, dateRegistration: row.DateRegistration, dateLastActivity: row.DateLastActivity })}
                                              >
                                                  <span>Edit</span>
                                                  </button>{' '}
                                              <button
                                                  className={"btn-table-delete"}
                                                  onClick={() => onDelete({ id: row.UserID })}
                                              >
                                                  <span>Delete</span>
                                                  </button>
                                                  </React.Fragment>
                                          )
                                      }
                                  </td>
                              </tr>
                          ))
                      }
                    </tbody>
                </table>
        </div >);


        const rollingRetention7days = rollingRetention && (
            <span>7 Day Rolling Retention is {rollingRetention.toFixed(0)}%</span>
        );

        const usersLifetimeHistogram = histogramData && (
            <Chart
                width={'1000px'}
                height={'500px'}
                chartType="Histogram"
                loader={<div>Loading Chart</div>}
                data={histogramData}
                options={{
                    title: 'Lifetime of users, in days',
                    legend: { position: 'none' },
                    hAxis: {
                        title: 'lifetime (days)',
                        viewWindowMode: 'explicit',
                    },
                     vAxis: {
                        title: 'number of users',
                        viewWindowMode: 'explicit',
                    },
                    histogram: {
                        bucketSize: 1,
                        minValue: 0,
                        maxValue: Math.max.apply(Math, histogramData.map(elem => elem.LifeTime)),
                    }
                }}
                rootProps={{ 'data-testid': '1' }}
            />
            );

      let contents = this.state.loading
          ? <p><em>Loading...</em></p>
          : usersTable;

    return (
      <div>
        <h1 id="tabelLabel" >Users Activity Evaluation</h1>
        <p>Fill the table with users data, then click on button Save.</p>
            {contents}
            <button className={"btn-secondary"} onClick={this.addRow} ><span>Add row</span></button>{' '}
            <button className={"btn-primary"} onClick={this.saveTable}><span>Save</span></button>{' '}
            <button className={"btn-primary"} onClick={this.showRollingRetention}><span>Show Rolling Retention 7 day</span></button>{' '}
            <button className={"btn-primary"} onClick={this.showHistogram}><span>{displayHistogram ? 'Refresh histogram' : 'Show histogram'}</span></button>{' '}
            <div>{displayRollingRetention && rollingRetention7days}</div>
            <div>{displayHistogram && usersLifetimeHistogram}</div>
      </div>
    );
  }

    async sendUsersTable(tableContent) {
        await fetch('users_table', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: tableContent
        });
    }
    async getLifetimeHistogram() {
        const response = await fetch('lifetime_histogram', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                //'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        const parsedData = JSON.parse(data);
        console.log(parsedData);
        this.setState({ histogramData: [["UserID", "Lifetime"], ...parsedData.map(element => [element.UserID.toString(), element.LifeTime])] }, () => console.log(this.state.histogramData));
    }
    async getRollingRetention(daysNumber) {
        const response = await fetch(`rolling_retention/${daysNumber}`, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
            },
        });
        const data = await response.json();
        const parsedData = JSON.parse(data);
        console.log(parsedData);
        this.setState({ rollingRetention: parsedData });
    }

    async getUsersData() {
        const response = await fetch('users_table', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        const parsedData = JSON.parse(data);
        console.log(parsedData);
        this.setState({
            rows: parsedData.map(row => ({
                UserID: row.UserID,
                DateRegistration: row.DateRegistration,
                DateLastActivity: row.DateLastActivity,
            }))
        });
    }
}
