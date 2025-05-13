import { Search } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchModal = () => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (keyword.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="bg-[#F0F2F5] sm:w-[240px] w-10 h-10 ml-2 sm:rounded-2xl rounded-full flex items-center">
            <Search className="text-[#9CA3AF] ml-2" />
            <input
                type="text"
                className="bg-[#F0F2F5] outline-none p-2 rounded-2xl w-full sm:inline-block hidden"
                placeholder="Tìm kiếm"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

export default SearchModal;
