import React from 'react';
import ReactDOM from 'react-dom';
import ReactFileReader from 'react-file-reader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './index.css';




class ChartComponent extends React.Component {
  

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
      
    renderLines(){
        let lines = [];
        this.props.keys.forEach(element => {
            lines.push(<Line key={element} type="monotone" dataKey={element} stroke={this.getRandomColor()} />);
        });
        return lines;
    }
    render() {

        return (
            <LineChart width={600} height={300} data={this.props.data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="year" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                {this.renderLines()}
              
            </LineChart>
        );

       
    }
}


class App extends React.Component {
    constructor() {
        super();
        this.state = {
            chartData:[],
            chartKeys:[]
        }
    }

    handleFiles = files => {
        let self = this;
        var reader = new FileReader();
        reader.onload = function (e) {
            // Use reader.result
            console.log(reader.result);
            let contents = reader.result;
            let records = contents.split('\n');
            let data = {};
            let chartKeys=[];
            records.forEach(record => {
                let row = record.split(',');
                let seriesName = row[0];
                chartKeys.push(seriesName);
                for(let i=1;i<row.length;i++){
                    let point = row[i].split('|');
                    let year = point[0];
                    let value = point[1];
                    if(!data[year]){
                        data[year]={}
                    } 
                    data[year][seriesName]=Number(value);
                }
            });
        
            let chartData = [];
            Object.keys(data).forEach(year=>{
                data[year].year = year;
                let chartRecord = data[year];
                chartData.push(chartRecord);
            })
            console.log('chart data',chartData);
            self.setState({chartData,chartKeys});
        }
        reader.readAsText(files[0]);
    }

    render() {
        return (
            <div className="app">
                <div >
                    <ReactFileReader handleFiles={this.handleFiles} fileTypes={'.csv'}>
                        <button className='btn'>Upload</button>
                    </ReactFileReader>
                </div>
                <div className="chart">
                    <ChartComponent data={this.state.chartData} keys ={this.state.chartKeys}/>
                </div>
                <div>

                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
