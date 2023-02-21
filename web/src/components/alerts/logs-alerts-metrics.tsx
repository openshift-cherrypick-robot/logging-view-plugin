import React, { useEffect } from 'react';
import { useLogs } from '../../hooks/useLogs';
import { Rule, TimeRange } from '../../logs.types';
import { LogsMetrics } from '../logs-metrics';
import { TimeRangeDropdown } from '../time-range-dropdown';

interface LogsAlertMetricsProps {
  rule?: Rule;
}

const LOKI_TENANT_LABEL_KEY = 'tenantId';

const LogsAlertMetrics: React.FC<LogsAlertMetricsProps> = ({ rule }) => {
  const { getLogs, logsData, logsError, isLoadingLogsData, config } = useLogs();

  const tenant = rule?.labels?.[config.lokiTenanLabelKey ?? LOKI_TENANT_LABEL_KEY];
  const [timeRange, setTimeRange] = React.useState<TimeRange | undefined>();

  useEffect(() => {
    if (rule?.query && tenant) {
      getLogs({ query: rule.query, timeRange, tenant });
    }
  }, [rule?.query, timeRange]);

  const tenantError = !tenant
    ? new Error(`label '${LOKI_TENANT_LABEL_KEY} is required to display the alert metrics`)
    : undefined;

  return (
    <div className="co-logs-alert-metrics__container">
      <div className="co-logs-metrics__header">
        <TimeRangeDropdown value={timeRange} onChange={setTimeRange} />
      </div>
      <LogsMetrics
        logsData={logsData}
        error={logsError || tenantError}
        isLoading={isLoadingLogsData}
        timeRange={timeRange}
      />
    </div>
  );
};

export default LogsAlertMetrics;
