import SearchIcon from '@mui/icons-material/Search';
import useFormatMessage from 'hooks/useFormatMessage';

import { InputBase,Search, SearchIconWrapper } from './style';

type SearchInputProps = {
  onChange?: (event: React.ChangeEvent) => void;
};

export default function SearchInput({ onChange }: SearchInputProps) {
  const formatMessage = useFormatMessage();

  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>

      <InputBase
        placeholder={formatMessage('searchPlaceholder')}
        inputProps={{ 'aria-label': 'search' }}
        onChange={onChange}
      />
    </Search>
  );
}
