import React from 'react';
import Header from './Header';
import Inventory from './Inventory';
import Order from './Order';
import Fish from './Fish';
import base from '../base';
import sampleFishes from '../sample-fishes.js';

class App extends React.Component {
    constructor(){
        super();
        this.addFish = this.addFish.bind(this);
        this.loadSamples = this.loadSamples.bind(this);
        this.addToOrder = this.addToOrder.bind(this);
        //getInitialState 
        this.state = {
            fishes: {},
            order: {}
        };
    }
    
    componentWillMount(){
        this.ref = base.syncState(`${this.props.params.storeId}/fishes`, {
            context: this,
            state: 'fishes'
        });
    }
    
    componentWillUnmount(){
        base.removeBinding(this.ref)
    }
    
    addFish(fish){
        //update our state
        const fishes = {...this.state.fishes}; //Coge cada item del objeto fishes y lo extiende sobre el nuevo objeto, es un backup
        //add in our new fish
        const timestamp = Date.now();
        fishes[`fish-${timestamp}`] = fish;
        //set state
        this.setState({ fishes: fishes }) //o solo {fishes}
    }
    
    loadSamples(){
        this.setState({
            fishes: sampleFishes
        })
    }
    
    addToOrder(key){
        //copy of our actual state
        const order = {...this.state.order};
        //add fish to the order or update quantity
        order[key] = order[key] + 1 || 1;
        //update state
        this.setState ({ order });
    }
    
    render(){
        return(
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market" />
                    <ul className="list-of-fishes">
                        {
                            Object
                                .keys(this.state.fishes)
                                .map( key => <Fish key={key} index={key} details={ this.state.fishes[key] } addToOrder={this.addToOrder} /> )
                        }
                    </ul>
                </div>
                <Order fishes={this.state.fishes} order={this.state.order} />
                <Inventory addFish={this.addFish} loadSamples={this.loadSamples} />
            </div>
        )
    }
}

export default App;