import React from 'react'
import { Table, Column, Cell } from 'fixed-data-table';
import Moment from 'moment';
import Promise from 'bluebird';

var SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

function reverseSortDirection(sortDir) {
  return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC;
}

class SortHeaderCell extends React.Component {
  constructor(props) {
    super(props);
    this._onSortChange = this._onSortChange.bind(this);
  }

  render() {
    var {sortDir, children, ...props} = this.props;
    return (
      <Cell {...props}>
        <a onClick={this._onSortChange}>
          {children} {sortDir ? (sortDir === SortTypes.DESC ? '↓' : '↑') : ''}
        </a>
      </Cell>
    )
  }

  _onSortChange(e) {
    e.preventDefault();
    if (this.props.onSortChange) {
      this.props.onSortChange(
        this.props.columnKey,
        this.props.sortDir ?
          reverseSortDirection(this.props.sortDir) :
          SortTypes.DESC
      );
    }
  }
}

class DataListWrapper {
  constructor(indexMap, data) {
    return this.createArray(indexMap, data)
  }

  createArray(indexMap, data) {
    let sortedArr = []
    for (var i=0; i<data.length; i++) {
      let next = data[indexMap[i]]
      sortedArr.push(next)
    }
    return sortedArr;
  }
}

class CampaignTable extends React.Component {
  constructor(props) {
    super(props);

    this._dataList = this.props.contributions

    this._defaultSortIndexes = [];
    var size = this._dataList.length;
    for (var index = 0; index < size; index++) {
      this._defaultSortIndexes.push(index);
    }

    this.state = {
      sortedDataList: this._dataList,
      colSortDirs: {},
    };

    this._onSortChange = this._onSortChange.bind(this);
  }

  _onSortChange(columnKey, sortDir) {
    var sortIndexes = this._defaultSortIndexes.slice();

    sortIndexes.sort((indexA, indexB) => {

      var valueA, valueB = ''
      switch(columnKey) {
        case "date":
        case "amount":
          valueA = this._dataList[indexA][columnKey]
          valueB = this._dataList[indexB][columnKey]
          break;
        case "name":
        case "contributorType":
          valueA = this._dataList[indexA]['contributor'][columnKey];
          valueB = this._dataList[indexB]['contributor'][columnKey];
          break;
        case "address":
        valueA = this._dataList[indexA]['contributor'][columnKey]['raw'];
        valueB = this._dataList[indexB]['contributor'][columnKey]['raw'];
          break;
        default:
          console.log("warning check datatype with _onSortChange")
          valueA = this._dataList[indexA][columnKey]
          valueB = this._dataList[indexB]['contributor'][columnKey];
      }
      var sortVal = 0;
      if (valueA > valueB) {
        sortVal = 1;
      }
      if (valueA < valueB) {
        sortVal = -1;
      }
      if (sortVal !== 0 && sortDir === SortTypes.ASC) {
        sortVal = sortVal * -1;
      }
      return sortVal;
    });

    this.setState({
      sortedDataList: new DataListWrapper(sortIndexes, this._dataList),
      colSortDirs: {
        [columnKey]: sortDir,
      },
    });
  }

  render () {
    var {sortedDataList, colSortDirs} = this.state;
    return (
      <Table rowsCount={sortedDataList.length}
          rowHeight={50}
          headerHeight={50}
          width={900}
          height={500}
          {...this.props}>
              <Column
                  columnKey="name"
                  header={
                    <SortHeaderCell
                      onSortChange={this._onSortChange}
                      sortDir={colSortDirs.name}>
                      Name
                    </SortHeaderCell>
                  }

                  cell={props => (
                            <Cell {...props}>{sortedDataList[props.rowIndex].contributor.name}</Cell>
                        )}
                  width={200}
                  fixed={true}
              />
              <Column
                columnKey="amount"
                header = {
                <SortHeaderCell
                  onSortChange={this._onSortChange}
                  sortDir={colSortDirs.amount}>
                  Amount
                </SortHeaderCell>
                }
                cell={props => (
                          <Cell {...props}>${sortedDataList[props.rowIndex].amount}</Cell>
                      )}
                  width={100}
                  fixed={true}
              />
              <Column
                columnKey="address"
                header= {
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={colSortDirs.address}>
                    Address
                  </SortHeaderCell>
                }
                cell={props => (
                          <Cell {...props}>{sortedDataList[props.rowIndex].contributor.address.raw}</Cell>
                      )}

                width={300}
              />
              <Column
                columnKey="contributorType"
                header= {
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={colSortDirs.contributorType}>
                    Contributor Type
                  </SortHeaderCell>
                }
                cell={props => (
                        <Cell {...props}>{sortedDataList[props.rowIndex].contributor.contributorType}</Cell>
                    )}

                width={100}
              />
              <Column
                columnKey="date"

                header= {
                  <SortHeaderCell
                    onSortChange={this._onSortChange}
                    sortDir={colSortDirs.date}>
                    Date
                  </SortHeaderCell>
                }
                cell={props => (
                        <Cell {...props}>{Moment(sortedDataList[props.rowIndex].date).format('MM/DD/YYYY')}</Cell>
                )}

                width={200}
              />
      </Table>
    )
  }

}

export default CampaignTable;
