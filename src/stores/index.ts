import ConverterStore from "./ConverterStore"
import CurrenciesStore from "./CurrenciesStore"

const stores = {
    converterStore: new ConverterStore(),
    currenciesStore: new CurrenciesStore()
}

export default stores