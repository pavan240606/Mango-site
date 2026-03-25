import { formatLastUpdated } from '../utils/dateFormat';

interface LastUpdatedBarProps {
  lastUpdated: Date;
}

export function LastUpdatedBar({ lastUpdated }: LastUpdatedBarProps) {
  return (
    <div className="!m-0 !p-0 !mb-0 !mt-0" style={{ margin: '0 !important', padding: '0 !important', marginBottom: '0 !important', marginTop: '0 !important' }}>
      <p className="text-gray-600 text-sm text-right !m-0 !p-0 !pb-1 !pt-1 !px-5" style={{ margin: '0 !important', paddingTop: '4px !important', paddingBottom: '4px !important', paddingLeft: '20px !important', paddingRight: '20px !important' }}>
        Last updated: {formatLastUpdated(lastUpdated)}
      </p>
    </div>
  );
}