/*
 * Copyright (c) 2024 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

import type { DtrConfigPinDefinition } from '../../common/boards/BoardControllerConfigDefinition';
import PinConfigPanel from './PinConfigPanel';

import './vcomconfig.scss';

interface TWIConfigurationProps {
    pinConfig: DtrConfigPinDefinition;
}

const DTRConfiguration = ({ pinConfig }: TWIConfigurationProps) => (
    <PinConfigPanel
        portName={pinConfig.name}
        panelTitle={pinConfig.name}
        titleTooltip="Connect or disconnect control signals for the UART power management for the nRF9151 SiP when it is running the nRF91M1 module firmware. When enabled, UART is powered on and active (the DTR line is pulled low and DTR is asserted.) When disabled, UART is powered off and inactive (the DTR line is pulled high and DTR is deasserted.)"
        dependentPinTitle="Connect the DTR pin to the interface MCU"
        dependentPinTooltip="Connect or disconnect the DTR pin (P0.31) on the nRF9151 SiP (running nRF91M1 module firmware) to the IMCU (P0.17) on the nRF5340 SoC."
        mainPinEnable={pinConfig.enable.pin}
        dependantPinEnable={pinConfig.dependantPin.pin}
        mainPinEnableInvert={pinConfig.enable.invert ?? false}
        dependantPinEnableInvert={pinConfig.dependantPin.invert ?? false}
        dependantRequiredWhenMainOn
    />
);

export default DTRConfiguration;
