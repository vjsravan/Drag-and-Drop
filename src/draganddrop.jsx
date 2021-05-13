import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import _  from 'lodash';
import './draganddrop.css';

class Drag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCountry: "",
            uniqueProducts: [],
            selectedProducts : [],
            salesListToDisplay: []
        }
    }

    columnDefs= [
    {
        field: 'name',
        rowDrag: true,
    }];

    productColumnDefs= [
    {
        field: 'product',
        rowDrag: true,
    }];

    salesColumnDefs= [
        {
            field: 'area'
        },
        {
            field: 'country'
        },
        {
            field: 'productType'
        },
        {
            field: 'year'
        },
        {
            field: 'channel'
        },
        {
            field: 'orderDate'
        },
        {
            field: 'orderId'
        },
        {
            field: 'shipDate'
        },
        {
            field: 'unitsSold'
        },
        {
            field: 'unitPrice'
        },
        {
            field: 'unitCost'
        },
        {
            field: 'totalRevenue'
        },
        {
            field: 'totalCost'
        },
        {
            field: 'totalProfit'
        }
    ];

    defaultColDef= {
        filter: true,
        flex: 1,
        sortable: true
    };

    onGridReady = (params)=> {
        this.countryGridApi = params.api;
        var tileContainer = document.getElementById("country-selection");
        var dropZone = {
        getContainer: function () {
            return tileContainer;
        },
        onDragStop:  (event) => {
            this.setState({
                selectedCountry: event.node.data.name
            });
            // once a country is selected, get list of all unique products available in that country
            this.setState({
                uniqueProducts: _.uniqBy(this.props.sales.filter(row => row[1]===event.node.data.name).map(row => {return {product: row[2]};} ), "product")
            });
        }
        };
        params.api.addRowDropZone(dropZone);
    };

    onProductsGridReady = (params)=> {
        this.countryGridApi = params.api;
        var tileContainer = document.getElementById("product-selection");
        var dropZone = {
        getContainer: function () {
            return tileContainer;
        },
        onDragStop:  (event) => {
            console.log("this props"+this.props);
            this.setState({
                selectedProducts: event.nodes.map(node => node.data.product)
            }, () => {
                // based on the selected country and list of products , filter the sales data and set them in state to display 
                this.setState({
                    salesListToDisplay: _.uniq(this.props.sales.filter(row => row[1] === this.state.selectedCountry  && this.state.selectedProducts.indexOf(row[2]) !== -1))
                    .map(sale => {
                        return {
                        area: sale[0],
                        country: sale[1],
                        productType: sale[2],
                        year: sale[3],
                        channel: sale[4],
                        orderDate: sale[5],
                        orderId: sale[6],
                        shipDate: sale[7],
                        unitsSold: sale[8],
                        unitPrice: sale[9],
                        unitCost: sale[10],
                        totalRevenue: sale[11],
                        totalCost: sale[12],
                        totalProfit: sale[13]
                    };
                })
                });
            });
        }
        };
        params.api.addRowDropZone(dropZone);
    };

    render() {
        return (
                
            <div>
                <div className="countrys">COUNTRIES</div>
                <div className="container">
                <div style={{ width: '200px', height: '500px' }} className="ag-theme-alpine">
                    <AgGridReact className = "country-table"
                    columnDefs={this.columnDefs}
                    rowData={this.props.countrys}
                    rowDragManaged={true}
                    animateRows={true}
                    onGridReady={this.onGridReady}
                    suppressMoveWhenRowDragging={true}
                    />
                </div>
                <br />
                <div className="country-input">
                    Please select a Country  by dragging from the list:
                    <input type="text" id="country-selection" value={this.state.selectedCountry}/>
                </div>
                
                <br />
                {
                    this.state.selectedCountry &&
                    (
                        <>
                            <div style={{ width: '200px', height: '500px' }} className="ag-theme-alpine">
                                <AgGridReact className="product-table"
                                columnDefs={this.productColumnDefs}
                                rowData={this.state.uniqueProducts}
                                rowDragManaged={true}
                                animateRows={true}
                                onGridReady={this.onProductsGridReady}
                                enableMultiRowDragging={true}
                                rowSelection={"multiple"}
                                suppressMoveWhenRowDragging={true}
                                />
                            </div>
                            <br/>

                            <div className="product-input">
                            Please select a list of products by selecting and dragging from the list:
                            <textarea id="product-selection" rows="10" columns="50" value={_.isEmpty(this.state.selectedProducts)? "":this.state.selectedProducts.join("\n")}/>
                            </div>
                            
                        </>
                    )
                }
                </div>
                <br/>
                
                {
                    this.state.selectedProducts.length > 0 && 
                    (
                        <>
                        <div className="output">OUTPUT :</div>
                        <div style={{ width: '100%', height: '500px' }} className="ag-theme-alpine">
                            <AgGridReact
                            columnDefs={this.salesColumnDefs}
                            defaultColDef={this.state.defaultColDef}
                            rowData={this.state.salesListToDisplay}
                            />
                        </div>
                    </>
                    )
                }
                <br />
            </div>
        );
    }
    
}

export default Drag;