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
        titleTooltip="Connect or disconnect control signals for the UART power management for the nRF9151 SiP when it is running the nRF91M1 module firmware. When enabled, UART is powered on and active (the DTR line is pulled low and DTR is asserted.) When disabled, UART is powered off and inactive (the DTR line is pulled high and DTR is deasserted.)"
        dependentPinTitle="Connect the DTR pin to the interface MCU"
        dependentPinTooltip="Connect or disconnect the DTR pin (P0.31) on the nRF9151 SiP (running nRF91M1 module firmware) to the IMCU (P0.17) on the nRF5340 SoC."
        mainPinEnable={dtrEnablePin}
        dependantPinEnable={enablerPin}
        mainPinEnableInvert={enableInvert}
        dependantPinEnableInvert={dependantPinInvert}
        dependantRequiredWhenMainOn
    />
);

export default DTRConfiguration;
