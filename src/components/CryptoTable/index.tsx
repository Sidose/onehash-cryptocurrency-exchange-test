import React from "react";
import { observer, inject } from "mobx-react";

import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import { TCoin, TCoinDiff } from "../../types";
import CurrenciesStore from "../../stores/CurrenciesStore";
import ConverterStore from "../../stores/ConverterStore";


type ICryptoTable = {
    classes: any,
    converterStore?: ConverterStore,
    currenciesStore?: CurrenciesStore
}

const CryptoTable = inject('currenciesStore','converterStore')(
    observer(({ classes, converterStore, currenciesStore}: ICryptoTable) => {
        const items: TCoin[] = currenciesStore!.getItems;
        const diffObj: TCoinDiff = currenciesStore!.getDiffObj;

        React.useEffect(() => {
            if (currenciesStore) {
                currenciesStore.fetchCoins()
                setInterval(() => {
                    currenciesStore.fetchCoins()
                }, 30 * 1000)
            }
        }, [])

        const onClickRow = (coin: TCoin) => {
            if (converterStore) {
                converterStore.setSelectedCoin(coin)
            }
        }

        return (
            <TableContainer component={Paper}>
                <Table stickyHeader className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">FullName</TableCell>
                            <TableCell align="left">Price</TableCell>
                            <TableCell align="left">volume24hour</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!items.length ? 'Loading...' : items.map((coin) => (
                            <TableRow onClick={() => onClickRow(coin)} className={classes.rowCurrency} hover key={coin.name}>
                                <TableCell><img className={classes.currencyIcon} src={coin.imageUrl} alt='Coin icon' /></TableCell>
                                <TableCell align="left">{coin.name}</TableCell>
                                <TableCell align="left">{coin.fullName}</TableCell>
                                <TableCell className={diffObj[coin.name] && classes[`${diffObj[coin.name]}Column`]} align="left">${coin.price}</TableCell>
                                <TableCell align="left">${coin.volume24hour}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    })
)

export default CryptoTable