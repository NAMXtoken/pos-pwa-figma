import Btn from "./components/generated/Btn"
import Categories from "./components/generated/Categories"
import Menu from "./components/generated/Menu"
import SearchBox from "./components/generated/SearchBox"
import TicketCard from "./components/generated/TicketCard"
export default function Cashier() {
  return (
    <div className="bg-white dark:bg-gray-900 relative size-full" data-name="Cashier">
      <Menu />
      <Categories />
      <SearchBox />
      <Btn />
      <TicketCard />
    </div>
  )
}

