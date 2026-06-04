/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import PinConfigPanel from './PinConfigPanel';

import './vcomconfig.scss';

interface TWIConfigurationProps {
    portName: string;
    dtrEnablePin: number;
    enablerPin: number;
    enableInvert: boolean;
    dependantPinInvert: boolean;
}

const DTRConfiguration = ({
    portName,
    dtrEnablePin,
    enablerPin,
    enableInvert,
    dependantPinInvert,
}: TWIConfigurationProps) => (
    <PinConfigPanel
        portName={portName}
        panelTitle={portName}
        titleTooltip="Host signals UART is powered on. OUTPUT, ACTIVE LOW" // todo: refine
        dependentPinTitle="TGT_TWI_CTRL, Active high to enable DTR"
        mainPinEnable={dtrEnablePin}
        dependantPinEnable={enablerPin}
        mainPinEnableInvert={enableInvert}
        dependantPinEnableInvert={dependantPinInvert}
    />
);

export default DTRConfiguration;
