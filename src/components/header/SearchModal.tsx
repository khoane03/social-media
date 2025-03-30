import { Search, } from '@mui/icons-material';

const SearchModal = () => {

    return (
        <div className="bg-[#F0F2F5] sm:w-[240px] w-10 h-10 ml-2 sm:rounded-2xl rounded-full flex items-center">
            <Search className="text-[#9CA3AF] ml-2" />
            <input type="text"
                className="bg-[#F0F2F5] outline-none p-2 rounded-2xl w-full sm:inline-block hidden "
                placeholder="Tìm kiếm" />
        </div>

    );
}
export default SearchModal;