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
        this.removeFish = this.removeFish.bind(this);
        this.loadSamples = this.loadSamples.bind(this);
        this.addToOrder = this.addToOrder.bind(this);
        this.removeFromOrder = this.removeFromOrder.bind(this);
        this.updateFish = this.updateFish.bind(this);
        //getInitialState 
        this.state = {
            fishes: {},
            order: {}
        };
    }
    
    componentWillMount(){
        //se ejecuta justo antes que render()
        this.ref = base.syncState(`${this.props.params.storeId}/fishes`, {
            context: this,
            state: 'fishes'
        });
        //comprobar si hay información en localStorage
        const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`)
        if(localStorageRef){
            //si hay datos en localStorage aplicarlos a order
            this.setState({
                order: JSON.parse(localStorageRef),
            })
        }
    }
    
    componentWillUnmount(){
        base.removeBinding(this.ref)
    }
    
    componentWillUpdate(nextProps, nextState){
        localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));
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
    
    updateFish(key, updatedFish){
        const fishes = {...this.state.fishes};
        fishes[key] = updatedFish;
        this.setState({ fishes});
    }
    
    removeFish(key){
        const fishes = {...this.state.fishes};
        fishes[key] = null; //con Firebase delete no funciona bien
        this.setState({ fishes });
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
        this.setState({ order });
    }
    
    removeFromOrder(key){
        const order = {...this.state.order};
        delete order[key];
        this.setState({ order });
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
                <Order 
                    fishes={this.state.fishes} 
                    order={this.state.order} 
                    params={this.state.params}
                    removeFromOrder={this.removeFromOrder}
                    />
                <Inventory 
                    addFish={this.addFish} 
                    loadSamples={this.loadSamples} 
                    fishes={this.state.fishes}
                    updateFish={this.updateFish}
                    removeFish={this.removeFish}
                    storeId={this.props.params.storeId}
                    />
            </div>
        )
    }
}

App.PropTypes = {
    params: React.PropTypes.object.isRequired
}

export default App;