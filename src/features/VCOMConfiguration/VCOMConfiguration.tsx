/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import PinConfigPanel from './PinConfigPanel';

import './vcomconfig.scss';

interface VCOMConfigurationProps {
    vcomName: string;
    vcomEnablePin: number;
    hwfcEnablePin: number;
    enableInvert: boolean;
    hwfcInvert: boolean;
}

const VCOMConfiguration = ({
    vcomName,
    vcomEnablePin,
    hwfcEnablePin,
    enableInvert,
    hwfcInvert,
}: VCOMConfigurationProps) => (
    <PinConfigPanel
        portName={vcomName}
        panelTitle={`Connect port ${vcomName}`}
        titleTooltip={`Connect or disconnect the pins used for
                             the virtual COM port. When disconnected,
                             the corresponding UART GPIO pins can be
                             used for other purposes.
            `}
        dependentPinTitle={`${vcomName} HWFC autodetect lines`}
        dependentPinTooltip={`Connect or disconnect the Hardware Flow
                                    Control pins for the virtual COM port.
                                    When disconnected, the HWFC GPIO pins
                                    for the target chip can be used for
                                    other purposes. When connected, an
                                    autodetect feature is used to determine
                                    whether or not HWFC is enabled on the
                                    target chip.
            `}
        mainPinEnable={vcomEnablePin}
        dependantPinEnable={hwfcEnablePin}
        mainPinEnableInvert={enableInvert}
        dependantPinEnableInvert={hwfcInvert}
    />
);

export default VCOMConfiguration;
