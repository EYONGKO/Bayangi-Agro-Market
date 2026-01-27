export type BrowsePillItem = {
  id: string;
  label: string;
};

type Props = {
  title: string;
  items: BrowsePillItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  showMore?: boolean;
  onMore?: () => void;
};

const BrowseByInterestPills = ({ title, items, selectedId, onSelect, showMore, onMore }: Props) => {
  return (
    <div style={{ padding: '32px 16px 20px', background: 'white' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div
          style={{
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: 900,
            color: '#111827',
            marginBottom: '24px',
            letterSpacing: '-0.02em'
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            gap: '10px',
            overflowX: 'auto',
            overflowY: 'hidden',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 16px',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none' // IE/Edge
          }}
        >
          {items.slice(0, showMore ? items.length - 1 : items.length).map((item) => {
            const active = selectedId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '999px',
                  border: active ? '2px solid #111827' : '1px solid #e5e7eb',
                  background: active ? '#111827' : '#ffffff',
                  color: active ? '#ffffff' : '#111827',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: active ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = '#111827';
                    e.currentTarget.style.background = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.background = '#ffffff';
                  }
                }}
              >
                {item.label}
              </button>
            );
          })}

          {showMore && (
            <button
              onClick={() => onMore?.()}
              style={{
                padding: '10px 18px',
                borderRadius: '999px',
                border: '1px solid #e5e7eb',
                background: '#ffffff',
                color: '#111827',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#111827';
                e.currentTarget.style.background = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.background = '#ffffff';
              }}
            >
              + More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseByInterestPills;
