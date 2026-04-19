
import styles from './NodePopover.module.css';
import {NODE_TYPE_ICONS, STATUS_COLORS, TopologyNodeData} from "@/features/nodePopover/types/types";

const EXCLUDED_FIELDS = ['id', 'label', 'type', 'status'];

const formatLabel = (key: string): string =>
    key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()).replace(/_/g, ' ');

const formatValue = (value: unknown): string => {
    if (value == null) return '—';
    if (typeof value === 'boolean') return value ? 'Да' : 'Нет';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
};

interface NodePopoverContentProps {
    data: TopologyNodeData;
}

export function NodePopoverContent({ data }: NodePopoverContentProps) {
    const { id, label, type, status } = data;
    const dynamicFields = Object.entries(data).filter(([key]) => !EXCLUDED_FIELDS.includes(key));

    return (
        <>
            <div className={styles.header}>
                <div className={styles.titleRow}>
          <span className={styles.icon} role="img" aria-label={type}>
            {NODE_TYPE_ICONS[type] || NODE_TYPE_ICONS.default}
          </span>
                    <h4 className={styles.title}>{label}</h4>
                </div>
                <div className={styles.badges}>
          <span className={styles.badge} style={{ backgroundColor: STATUS_COLORS[status] || STATUS_COLORS.default }}>
            {status}
          </span>
                    <span className={styles.badgeSecondary}>{type}</span>
                </div>
            </div>

            {dynamicFields.length > 0 && (
                <dl className={styles.details}>
                    {dynamicFields.map(([key, value]) => (
                        <div key={key} className={styles.detailRow}>
                            <dt className={styles.detailKey}>{formatLabel(key)}:</dt>
                            <dd className={styles.detailValue}>{formatValue(value)}</dd>
                        </div>
                    ))}
                </dl>
            )}

            <div className={styles.footer}>
                <small className={styles.nodeId}>ID: <code>{id}</code></small>
            </div>
        </>
    );
}