import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import React from "react";
import {inject, observer} from "mobx-react";
import CurrenciesStore from "../../stores/CurrenciesStore";
import ConverterStore from "../../stores/ConverterStore";
import {TSelectedCoin} from "../../types";

type IConverterBlock = {
    classes: any,
    currenciesStore?: CurrenciesStore,
    converterStore?: ConverterStore
}

type TReducerState = {
    value1: string,
    value2: string,
    inPrice: number,
    outPrice: number
}

type TSetValue1Action = {
    type: string;
    payload: string;
}

type TAction = TSetValue1Action

function reducer(state: TReducerState, action: any): TReducerState {
    switch (action.type) {
        case 'SET_VALUE':
            return {
                ...state,
                [action.payload.name]: action.payload.value,
                value2: String(Number(action.payload.value) * state.inPrice / state.outPrice)
            }
        case 'SET_PRICES':
            return {
                ...state,
                inPrice: action.payload.in,
                outPrice: action.payload.out,
            }
        default:
            return state;
    }
}

const ConverterBlock: React.FC<IConverterBlock> = inject(
    'currenciesStore',
    'converterStore'
)(
    observer(({ classes, currenciesStore, converterStore }) => {
        const [selectedOutCoin, setSelectedOutCoin] = React.useState('USD');
        const inPrice = Number(converterStore?.getSelectedCoin.price) || 0;
        const outPrice = Number(currenciesStore!.getItems.find(obj => obj.name === selectedOutCoin)?.price) || 0;
        const coins: string[] = currenciesStore!.getItems.map(coin => coin.name) || []
        const [state, dispatch] = React.useReducer(reducer, {
            value1: '',
            value2: '',
            inPrice,
            outPrice
        })

        React.useEffect(() => {
            dispatch({
                type: 'SET_PRICES',
                payload: {
                    in: inPrice,
                    out: outPrice
                }
            })
        }, [inPrice, outPrice])

        const onUpdateField = (name: string, value: string) => {
            dispatch({
                type: 'SET_VALUE',
                payload: {
                    name,
                    value
                }
            })
        }

        return (
            <Paper className={classes.paper}>
                <div className={classes.cryptoInputBox}>
                    <FormControl className={classes.currencyInput}>
                        <TextField
                            type="number"
                            value={state.value1}
                            onChange={(e: any) => onUpdateField('value1', e.target.value) }
                            label="Sum"
                        />
                    </FormControl>
                    <FormControl className={classes.currencyType}>
                        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                            Currency
                        </InputLabel>
                        <Select value={ converterStore?.getSelectedCoin.name || '' }>
                        {
                            coins.map(name => (<MenuItem value={name}>{name}</MenuItem>))
                        }
                        </Select>
                    </FormControl>
                </div>
                <div className={classes.cryptoInputBox}>
                    <FormControl className={classes.currencyInput}>
                        <TextField type="number" value={state.value2} label="Sum" />
                    </FormControl>
                    <FormControl className={classes.currencyType}>
                        <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                            Currency
                        </InputLabel>
                        <Select onChange={e => {
                            setSelectedOutCoin(e.target.value as string)
                        }} value={ selectedOutCoin }>
                            <MenuItem value={'USD'}>USD</MenuItem>
                            {
                            coins.map(name => (
                                <MenuItem value={name}>{name}</MenuItem>
                            ))
                        }
                        </Select>
                    </FormControl>
                </div>
            </Paper>
        )
    }
))

export default ConverterBlock